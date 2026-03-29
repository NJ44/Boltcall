-- SMS AI Auto-Reply System
-- Adds settings, AI response tracking, lead qualification via SMS, and sequence processing

-- ═══════════════════════════════════════════════════════════════════
-- SMS Settings (per-user config for AI auto-reply behavior)
-- ═══════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS sms_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  is_enabled BOOLEAN DEFAULT true,
  auto_reply_enabled BOOLEAN DEFAULT false,  -- false = generate draft, true = auto-send
  response_tone TEXT DEFAULT 'professional',  -- 'professional', 'friendly', 'casual'
  qualification_enabled BOOLEAN DEFAULT true,
  booking_enabled BOOLEAN DEFAULT true,
  calcom_event_slug TEXT,                     -- Cal.com event type for booking
  business_hours_only BOOLEAN DEFAULT false,
  business_hours_start TIME DEFAULT '09:00',
  business_hours_end TIME DEFAULT '17:00',
  business_timezone TEXT DEFAULT 'UTC',
  max_ai_messages_per_conversation INTEGER DEFAULT 10,
  greeting_template TEXT,                     -- Optional custom first-reply template
  out_of_hours_message TEXT,                  -- Auto-reply when outside business hours
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE sms_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own SMS settings"
  ON sms_settings FOR ALL
  USING (auth.uid() = user_id);

-- ═══════════════════════════════════════════════════════════════════
-- Add AI columns to sms_conversations
-- ═══════════════════════════════════════════════════════════════════

DO $$
BEGIN
  -- AI draft response
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'sms_conversations' AND column_name = 'ai_draft'
  ) THEN
    ALTER TABLE sms_conversations ADD COLUMN ai_draft TEXT;
  END IF;

  -- AI draft status: null, 'pending', 'approved', 'auto_sent', 'rejected'
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'sms_conversations' AND column_name = 'ai_draft_status'
  ) THEN
    ALTER TABLE sms_conversations ADD COLUMN ai_draft_status TEXT;
  END IF;

  -- Lead qualification result from AI
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'sms_conversations' AND column_name = 'qualification'
  ) THEN
    ALTER TABLE sms_conversations ADD COLUMN qualification JSONB;
    -- { intent: 'booking'|'inquiry'|'complaint'|'spam'|'other', score: 0-100, reason: '...' }
  END IF;

  -- Link to lead record
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'sms_conversations' AND column_name = 'lead_id'
  ) THEN
    ALTER TABLE sms_conversations ADD COLUMN lead_id UUID;
  END IF;

  -- Conversation thread grouping (by phone number pair)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'sms_conversations' AND column_name = 'thread_id'
  ) THEN
    ALTER TABLE sms_conversations ADD COLUMN thread_id TEXT;
    -- Format: normalized sorted phone pair, e.g. "+14155551234_+14155555678"
  END IF;

  -- Track if AI response was sent for this inbound message
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'sms_conversations' AND column_name = 'ai_responded_at'
  ) THEN
    ALTER TABLE sms_conversations ADD COLUMN ai_responded_at TIMESTAMPTZ;
  END IF;
END $$;

-- Index for thread-based conversation lookups
CREATE INDEX IF NOT EXISTS idx_sms_conversations_thread ON sms_conversations(thread_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_sms_conversations_lead ON sms_conversations(lead_id);
CREATE INDEX IF NOT EXISTS idx_sms_conversations_draft_status ON sms_conversations(ai_draft_status) WHERE ai_draft_status IS NOT NULL;

-- ═══════════════════════════════════════════════════════════════════
-- Add processed tracking to followup_enrollments
-- ═══════════════════════════════════════════════════════════════════

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'followup_enrollments' AND column_name = 'last_processed_at'
  ) THEN
    ALTER TABLE followup_enrollments ADD COLUMN last_processed_at TIMESTAMPTZ;
  END IF;
END $$;
