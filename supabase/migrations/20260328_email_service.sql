-- ============================================================================
-- Email Service Tables
-- Enables AI-powered email inbox monitoring, response generation, and sending
-- ============================================================================

-- 1. email_accounts — Connected Gmail/Outlook inboxes
CREATE TABLE IF NOT EXISTS email_accounts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  provider TEXT NOT NULL CHECK (provider IN ('gmail', 'outlook')),
  email_address TEXT NOT NULL,
  access_token TEXT NOT NULL,
  refresh_token TEXT,
  token_expires_at TIMESTAMPTZ,
  -- Gmail: historyId for incremental sync; Outlook: deltaLink for delta queries
  sync_cursor TEXT,
  last_synced_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  -- Settings: auto_send, response_tone, excluded_senders, daily_cap
  settings JSONB DEFAULT '{"auto_send": false, "response_tone": "professional", "excluded_senders": [], "daily_cap": 50}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_email_accounts_user_provider
  ON email_accounts(user_id, provider, email_address);
CREATE INDEX IF NOT EXISTS idx_email_accounts_active
  ON email_accounts(is_active) WHERE is_active = true;

-- 2. email_threads — Conversation threads linked to leads
CREATE TABLE IF NOT EXISTS email_threads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email_account_id UUID NOT NULL REFERENCES email_accounts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  lead_id UUID REFERENCES leads(id) ON DELETE SET NULL,
  -- Provider-native thread ID for dedup
  provider_thread_id TEXT NOT NULL,
  subject TEXT,
  sender_email TEXT,
  sender_name TEXT,
  last_message_at TIMESTAMPTZ,
  message_count INTEGER DEFAULT 0,
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'replied', 'closed', 'ignored')),
  is_lead_email BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_email_threads_provider
  ON email_threads(email_account_id, provider_thread_id);
CREATE INDEX IF NOT EXISTS idx_email_threads_user
  ON email_threads(user_id);
CREATE INDEX IF NOT EXISTS idx_email_threads_lead
  ON email_threads(lead_id);
CREATE INDEX IF NOT EXISTS idx_email_threads_status
  ON email_threads(user_id, status);

-- 3. email_messages — Individual messages in a thread
CREATE TABLE IF NOT EXISTS email_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  thread_id UUID NOT NULL REFERENCES email_threads(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  provider_message_id TEXT NOT NULL,
  direction TEXT NOT NULL CHECK (direction IN ('inbound', 'outbound')),
  from_address TEXT NOT NULL,
  to_addresses TEXT[] NOT NULL DEFAULT '{}',
  cc_addresses TEXT[] DEFAULT '{}',
  subject TEXT,
  body_text TEXT,
  body_html TEXT,
  -- AI draft fields
  ai_draft_text TEXT,
  ai_draft_html TEXT,
  ai_draft_status TEXT CHECK (ai_draft_status IN ('pending', 'approved', 'rejected', 'auto_sent', 'edited')),
  ai_draft_generated_at TIMESTAMPTZ,
  -- Sending fields
  sent_at TIMESTAMPTZ,
  sent_via TEXT CHECK (sent_via IN ('brevo', 'gmail_api', 'outlook_api')),
  brevo_message_id TEXT,
  received_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_email_messages_provider
  ON email_messages(thread_id, provider_message_id);
CREATE INDEX IF NOT EXISTS idx_email_messages_thread
  ON email_messages(thread_id);
CREATE INDEX IF NOT EXISTS idx_email_messages_drafts
  ON email_messages(user_id, ai_draft_status) WHERE ai_draft_status = 'pending';

-- ============================================================================
-- Row Level Security
-- ============================================================================

ALTER TABLE email_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_messages ENABLE ROW LEVEL SECURITY;

-- email_accounts policies
CREATE POLICY "Users can view own email accounts"
  ON email_accounts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own email accounts"
  ON email_accounts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own email accounts"
  ON email_accounts FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own email accounts"
  ON email_accounts FOR DELETE
  USING (auth.uid() = user_id);

-- Service role bypass for cron functions
CREATE POLICY "Service role full access to email_accounts"
  ON email_accounts FOR ALL
  USING (auth.role() = 'service_role');

-- email_threads policies
CREATE POLICY "Users can view own email threads"
  ON email_threads FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own email threads"
  ON email_threads FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own email threads"
  ON email_threads FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own email threads"
  ON email_threads FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "Service role full access to email_threads"
  ON email_threads FOR ALL
  USING (auth.role() = 'service_role');

-- email_messages policies
CREATE POLICY "Users can view own email messages"
  ON email_messages FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own email messages"
  ON email_messages FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own email messages"
  ON email_messages FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own email messages"
  ON email_messages FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "Service role full access to email_messages"
  ON email_messages FOR ALL
  USING (auth.role() = 'service_role');

-- ============================================================================
-- Helper function: count emails processed today for daily cap enforcement
-- ============================================================================
CREATE OR REPLACE FUNCTION get_email_daily_count(p_account_id UUID)
RETURNS INTEGER AS $$
  SELECT COUNT(*)::INTEGER
  FROM email_messages em
  JOIN email_threads et ON et.id = em.thread_id
  WHERE et.email_account_id = p_account_id
    AND em.direction = 'inbound'
    AND em.created_at >= CURRENT_DATE;
$$ LANGUAGE sql STABLE;
