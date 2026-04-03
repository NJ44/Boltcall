-- Fix plan_level constraint to match code: starter, pro, ultimate, enterprise
-- Drops the old constraint (which had 'agency') and adds the correct one

ALTER TABLE subscriptions DROP CONSTRAINT IF EXISTS subscriptions_plan_level_check;
ALTER TABLE subscriptions ADD CONSTRAINT subscriptions_plan_level_check
  CHECK (plan_level IN ('free', 'starter', 'pro', 'ultimate', 'enterprise'));

-- Add PayPal columns used by paypal-webhook.ts
ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS payment_provider TEXT DEFAULT 'paypal';
ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS paypal_subscription_id TEXT;
ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS paypal_payer_id TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS idx_subscriptions_paypal_subscription_id
  ON subscriptions(paypal_subscription_id) WHERE paypal_subscription_id IS NOT NULL;

-- PayPal payments log table (used by paypal-webhook.ts handlePaymentCompleted)
CREATE TABLE IF NOT EXISTS paypal_payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id TEXT UNIQUE NOT NULL,
  payer_email TEXT,
  payer_id TEXT,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  amount NUMERIC(10,2) NOT NULL DEFAULT 0,
  currency TEXT DEFAULT 'USD',
  status TEXT NOT NULL DEFAULT 'completed',
  raw_event JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE paypal_payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own PayPal payments"
  ON paypal_payments FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage all PayPal payments"
  ON paypal_payments FOR ALL
  USING (auth.role() = 'service_role');
