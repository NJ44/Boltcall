-- ============================================================
-- Usage Tracking & Enforcement System
-- Migration: 20260325_usage_tracking.sql
-- ============================================================

-- ── 1. Usage Logs table ──
-- Records every usage event for audit trail and trend analysis.
CREATE TABLE IF NOT EXISTS usage_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  resource_type TEXT NOT NULL CHECK (resource_type IN (
    'ai_voice_minutes',
    'ai_chat_messages',
    'sms_sent',
    'phone_numbers',
    'team_members',
    'kb_storage_mb'
  )),
  amount NUMERIC NOT NULL DEFAULT 1,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes for fast lookups
CREATE INDEX IF NOT EXISTS idx_usage_logs_user_id ON usage_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_usage_logs_resource_type ON usage_logs(resource_type);
CREATE INDEX IF NOT EXISTS idx_usage_logs_created_at ON usage_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_usage_logs_user_resource ON usage_logs(user_id, resource_type, created_at DESC);

-- RLS
ALTER TABLE usage_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own usage logs"
  ON usage_logs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own usage logs"
  ON usage_logs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Service role full access on usage_logs"
  ON usage_logs FOR ALL
  USING (auth.role() = 'service_role');

-- ── 2. Usage Summary view ──
-- Aggregates usage by user & resource for current billing period.
-- Uses token_balances.period_start for proper billing period alignment.
CREATE OR REPLACE VIEW usage_summary AS
SELECT
  ul.user_id,
  ul.resource_type,
  SUM(ul.amount) AS total_used,
  COUNT(*) AS event_count,
  MIN(ul.created_at) AS first_usage,
  MAX(ul.created_at) AS last_usage
FROM usage_logs ul
JOIN token_balances tb ON tb.user_id = ul.user_id
WHERE ul.created_at >= COALESCE(tb.period_start, date_trunc('month', now()))
GROUP BY ul.user_id, ul.resource_type;

-- ── 3. Daily Usage Summary view ──
-- For trend chart: aggregate by day for last 30 days.
CREATE OR REPLACE VIEW usage_daily_summary AS
SELECT
  ul.user_id,
  (ul.created_at AT TIME ZONE 'UTC')::date AS usage_date,
  ul.resource_type,
  SUM(ul.amount) AS total_used,
  COUNT(*) AS event_count
FROM usage_logs ul
WHERE ul.created_at >= (now() - interval '30 days')
GROUP BY ul.user_id, (ul.created_at AT TIME ZONE 'UTC')::date, ul.resource_type
ORDER BY (ul.created_at AT TIME ZONE 'UTC')::date;

-- ── 4. Add plan_limits JSONB column to subscriptions ──
-- Stores computed limits for the user's current plan tier.
ALTER TABLE subscriptions
  ADD COLUMN IF NOT EXISTS plan_limits JSONB DEFAULT '{}';

-- ── 5. Function to check usage limit ──
-- Returns TRUE if the user CAN use the resource (under limit).
CREATE OR REPLACE FUNCTION check_usage_limit(
  p_user_id UUID,
  p_resource_type TEXT,
  p_amount NUMERIC DEFAULT 1
) RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_plan_level TEXT;
  v_limit NUMERIC;
  v_current_usage NUMERIC;
BEGIN
  -- Get user's plan level
  SELECT plan_level INTO v_plan_level
  FROM subscriptions
  WHERE user_id = p_user_id
    AND status IN ('active', 'trialing')
  ORDER BY created_at DESC
  LIMIT 1;

  -- Default to 'free' if no subscription
  IF v_plan_level IS NULL THEN
    v_plan_level := 'free';
  END IF;

  -- Get limit from plan_limits JSONB (set by webhook)
  -- If not set, return true (allow) to avoid blocking users
  SELECT (plan_limits ->> p_resource_type)::NUMERIC INTO v_limit
  FROM subscriptions
  WHERE user_id = p_user_id
    AND status IN ('active', 'trialing')
  ORDER BY created_at DESC
  LIMIT 1;

  -- -1 means unlimited, NULL means not configured (allow)
  IF v_limit IS NULL OR v_limit = -1 THEN
    RETURN TRUE;
  END IF;

  -- Get current usage this period
  SELECT COALESCE(SUM(amount), 0) INTO v_current_usage
  FROM usage_logs
  WHERE user_id = p_user_id
    AND resource_type = p_resource_type
    AND created_at >= DATE_TRUNC('month', NOW());

  RETURN (v_current_usage + p_amount) <= v_limit;
END;
$$;

-- ── 6. Function to record usage ──
-- Inserts a usage log entry after checking limits.
CREATE OR REPLACE FUNCTION record_usage(
  p_user_id UUID,
  p_resource_type TEXT,
  p_amount NUMERIC DEFAULT 1,
  p_metadata JSONB DEFAULT '{}'
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_allowed BOOLEAN;
  v_log_id UUID;
BEGIN
  -- Check limit
  v_allowed := check_usage_limit(p_user_id, p_resource_type, p_amount);

  IF NOT v_allowed THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Usage limit reached for ' || p_resource_type
    );
  END IF;

  -- Record usage
  INSERT INTO usage_logs (user_id, resource_type, amount, metadata)
  VALUES (p_user_id, p_resource_type, p_amount, p_metadata)
  RETURNING id INTO v_log_id;

  RETURN jsonb_build_object(
    'success', true,
    'log_id', v_log_id
  );
END;
$$;
