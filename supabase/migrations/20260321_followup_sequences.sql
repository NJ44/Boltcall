-- Follow-up Sequences System
-- Provides automated multi-step drip sequences via SMS and email

-- Sequence definitions
CREATE TABLE IF NOT EXISTS followup_sequences (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  workspace_id UUID,
  name TEXT NOT NULL,
  trigger_event TEXT NOT NULL DEFAULT 'manual',
    -- 'missed_call', 'appointment_completed', 'lead_created', 'manual'
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Steps within a sequence
CREATE TABLE IF NOT EXISTS followup_sequence_steps (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sequence_id UUID REFERENCES followup_sequences(id) ON DELETE CASCADE,
  step_order INTEGER NOT NULL,
  channel TEXT NOT NULL DEFAULT 'sms', -- 'sms', 'email'
  delay_minutes INTEGER NOT NULL DEFAULT 1440, -- delay from previous step (or trigger), default 24h
  template TEXT NOT NULL,
  subject TEXT, -- for email channel
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enrollment tracking (which contacts are in which sequences)
CREATE TABLE IF NOT EXISTS followup_enrollments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sequence_id UUID REFERENCES followup_sequences(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  lead_id UUID,
  contact_name TEXT,
  contact_phone TEXT,
  contact_email TEXT,
  current_step INTEGER DEFAULT 0,
  status TEXT DEFAULT 'active', -- 'active', 'completed', 'cancelled', 'unsubscribed'
  enrolled_at TIMESTAMPTZ DEFAULT NOW(),
  next_step_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ
);

-- SMS conversations (for inbound SMS tracking)
CREATE TABLE IF NOT EXISTS sms_conversations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  workspace_id UUID,
  direction TEXT NOT NULL DEFAULT 'inbound', -- 'inbound', 'outbound'
  from_number TEXT NOT NULL,
  to_number TEXT NOT NULL,
  body TEXT NOT NULL,
  twilio_sid TEXT,
  media_urls JSONB,
  status TEXT DEFAULT 'received',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add subject column to scheduled_messages if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'scheduled_messages' AND column_name = 'subject'
  ) THEN
    ALTER TABLE scheduled_messages ADD COLUMN subject TEXT;
  END IF;
END $$;

-- RLS policies
ALTER TABLE followup_sequences ENABLE ROW LEVEL SECURITY;
ALTER TABLE followup_sequence_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE followup_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE sms_conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own sequences"
  ON followup_sequences FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage steps of their sequences"
  ON followup_sequence_steps FOR ALL
  USING (sequence_id IN (SELECT id FROM followup_sequences WHERE user_id = auth.uid()));

CREATE POLICY "Users can view their enrollments"
  ON followup_enrollments FOR ALL
  USING (user_id = auth.uid());

CREATE POLICY "Users can view their SMS conversations"
  ON sms_conversations FOR ALL
  USING (user_id = auth.uid());

-- Indexes
CREATE INDEX IF NOT EXISTS idx_enrollments_status ON followup_enrollments(status, next_step_at);
CREATE INDEX IF NOT EXISTS idx_enrollments_sequence ON followup_enrollments(sequence_id);
CREATE INDEX IF NOT EXISTS idx_sms_conversations_user ON sms_conversations(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_sequence_steps_order ON followup_sequence_steps(sequence_id, step_order);

-- ═══════════════════════════════════════════════════════════════════
-- Reactivation Campaigns (outbound calling)
-- ═══════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS reactivation_campaigns (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  agent_id TEXT NOT NULL,
  from_number TEXT NOT NULL,
  status TEXT DEFAULT 'draft', -- 'draft', 'running', 'paused', 'completed'
  total_leads INTEGER DEFAULT 0,
  calls_made INTEGER DEFAULT 0,
  calls_answered INTEGER DEFAULT 0,
  calls_booked INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS reactivation_leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  campaign_id UUID REFERENCES reactivation_campaigns(id) ON DELETE CASCADE,
  phone TEXT NOT NULL,
  name TEXT,
  email TEXT,
  call_status TEXT DEFAULT 'pending', -- 'pending', 'calling', 'completed', 'failed', 'no_answer'
  retell_call_id TEXT,
  call_outcome TEXT,
  called_at TIMESTAMPTZ
);

-- RLS
ALTER TABLE reactivation_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE reactivation_leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their campaigns"
  ON reactivation_campaigns FOR ALL
  USING (user_id = auth.uid());

CREATE POLICY "Users can view their campaign leads"
  ON reactivation_leads FOR ALL
  USING (campaign_id IN (SELECT id FROM reactivation_campaigns WHERE user_id = auth.uid()));

-- Indexes
CREATE INDEX IF NOT EXISTS idx_reactivation_leads_campaign ON reactivation_leads(campaign_id, call_status);
CREATE INDEX IF NOT EXISTS idx_reactivation_campaigns_user ON reactivation_campaigns(user_id, created_at DESC);

-- ═══════════════════════════════════════════════════════════════════
-- Workspace Members (team management)
-- ═══════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS workspace_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  workspace_id UUID,
  user_id UUID REFERENCES auth.users(id),
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'member', -- 'owner', 'admin', 'member'
  status TEXT DEFAULT 'pending', -- 'pending', 'active', 'removed'
  invited_by UUID REFERENCES auth.users(id),
  invite_token TEXT,
  invited_at TIMESTAMPTZ DEFAULT NOW(),
  accepted_at TIMESTAMPTZ
);

ALTER TABLE workspace_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members can view their workspace"
  ON workspace_members FOR ALL
  USING (
    workspace_id IN (
      SELECT workspace_id FROM workspace_members wm WHERE wm.user_id = auth.uid()
    )
  );

CREATE INDEX IF NOT EXISTS idx_workspace_members_workspace ON workspace_members(workspace_id);
CREATE INDEX IF NOT EXISTS idx_workspace_members_user ON workspace_members(user_id);
