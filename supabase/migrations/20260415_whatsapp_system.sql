-- WhatsApp Conversations table (mirrors sms_conversations)
CREATE TABLE IF NOT EXISTS whatsapp_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  workspace_id UUID,
  direction TEXT NOT NULL CHECK (direction IN ('inbound','outbound')),
  from_number TEXT NOT NULL,
  to_number TEXT NOT NULL,
  body TEXT NOT NULL,
  wa_message_id TEXT UNIQUE,
  media_urls JSONB DEFAULT '[]',
  status TEXT DEFAULT 'received' CHECK (status IN ('received','sent','failed')),
  thread_id TEXT NOT NULL,
  lead_id UUID,
  ai_draft TEXT,
  ai_draft_status TEXT CHECK (ai_draft_status IN ('pending','approved','rejected','auto_sent','edited')),
  qualification JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_wa_conv_user_thread ON whatsapp_conversations(user_id, thread_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_wa_conv_pending ON whatsapp_conversations(ai_draft_status) WHERE ai_draft_status = 'pending';

-- WhatsApp Settings table (mirrors sms_settings)
CREATE TABLE IF NOT EXISTS whatsapp_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  is_enabled BOOLEAN DEFAULT false,
  wa_phone_number_id TEXT,
  wa_access_token TEXT,
  wa_business_account_id TEXT,
  webhook_verify_token TEXT,
  auto_reply_enabled BOOLEAN DEFAULT false,
  response_tone TEXT DEFAULT 'professional',
  qualification_enabled BOOLEAN DEFAULT true,
  booking_enabled BOOLEAN DEFAULT true,
  business_hours_only BOOLEAN DEFAULT false,
  business_hours_start TEXT DEFAULT '09:00',
  business_hours_end TEXT DEFAULT '18:00',
  business_timezone TEXT DEFAULT 'UTC',
  max_ai_messages_per_conversation INTEGER DEFAULT 5,
  greeting_template TEXT,
  out_of_hours_message TEXT DEFAULT 'Thanks for reaching out! We''re currently closed but will reply soon.',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE whatsapp_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE whatsapp_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "owner_access_wa_conv" ON whatsapp_conversations;
CREATE POLICY "owner_access_wa_conv" ON whatsapp_conversations FOR ALL USING (user_id = auth.uid());

DROP POLICY IF EXISTS "owner_access_wa_settings" ON whatsapp_settings;
CREATE POLICY "owner_access_wa_settings" ON whatsapp_settings FOR ALL USING (user_id = auth.uid());
