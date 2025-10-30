-- Chats Table for BoltCall
-- This table stores chat conversations, status, history, and phone information
-- Run this SQL in your Supabase SQL Editor

-- Create chats table
CREATE TABLE chats (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
  
  -- Chat identification
  chat_session_id VARCHAR(255) UNIQUE NOT NULL, -- Unique session identifier
  external_chat_id VARCHAR(255), -- External system chat ID (e.g., from chat widget)
  
  -- Phone information
  primary_phone VARCHAR(20) NOT NULL, -- Main phone number
  secondary_phone VARCHAR(20), -- Alternative phone number
  phone_type VARCHAR(20) DEFAULT 'mobile', -- 'mobile', 'landline', 'voip', 'unknown'
  
  -- Chat participants
  customer_name VARCHAR(255),
  customer_email VARCHAR(255),
  customer_company VARCHAR(255),
  agent_id UUID REFERENCES auth.users(id), -- Assigned agent
  
  -- Chat status and state
  status VARCHAR(20) DEFAULT 'active', -- 'active', 'paused', 'closed', 'transferred', 'abandoned'
  priority VARCHAR(10) DEFAULT 'normal', -- 'low', 'normal', 'high', 'urgent'
  chat_type VARCHAR(20) DEFAULT 'inbound', -- 'inbound', 'outbound', 'transfer', 'callback'
  
  -- Chat timing
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_activity_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ended_at TIMESTAMP WITH TIME ZONE,
  duration_seconds INTEGER DEFAULT 0,
  
  -- Chat configuration
  language VARCHAR(10) DEFAULT 'en',
  timezone VARCHAR(50) DEFAULT 'UTC',
  source VARCHAR(50) DEFAULT 'website', -- 'website', 'phone', 'email', 'social', 'app'
  source_details TEXT,
  
  -- Chat content and history
  chat_history JSONB DEFAULT '[]', -- Array of chat messages
  message_count INTEGER DEFAULT 0,
  last_message TEXT,
  last_message_at TIMESTAMP WITH TIME ZONE,
  
  -- Customer context
  customer_sentiment VARCHAR(20), -- 'positive', 'neutral', 'negative', 'frustrated'
  customer_intent VARCHAR(50), -- 'inquiry', 'complaint', 'support', 'sales', 'booking'
  customer_urgency VARCHAR(20) DEFAULT 'normal', -- 'low', 'normal', 'high', 'urgent'
  
  -- Agent notes and tags
  agent_notes TEXT,
  internal_notes TEXT,
  tags TEXT[],
  
  -- Resolution and outcome
  resolution_status VARCHAR(20), -- 'resolved', 'unresolved', 'escalated', 'transferred'
  resolution_notes TEXT,
  follow_up_required BOOLEAN DEFAULT false,
  follow_up_date TIMESTAMP WITH TIME ZONE,
  
  -- Quality and satisfaction
  customer_satisfaction INTEGER, -- 1-5 rating
  agent_rating INTEGER, -- 1-5 rating
  quality_score DECIMAL(3,2), -- 0.00-10.00
  
  -- Integration and external data
  integration_data JSONB DEFAULT '{}', -- External system data
  metadata JSONB DEFAULT '{}', -- Additional metadata
  
  -- System tracking
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_chats_lead_id ON chats(lead_id);
CREATE INDEX idx_chats_session_id ON chats(chat_session_id);
CREATE INDEX idx_chats_status ON chats(status);
CREATE INDEX idx_chats_agent_id ON chats(agent_id);
CREATE INDEX idx_chats_started_at ON chats(started_at);
CREATE INDEX idx_chats_last_activity ON chats(last_activity_at);
CREATE INDEX idx_chats_primary_phone ON chats(primary_phone);
CREATE INDEX idx_chats_secondary_phone ON chats(secondary_phone);
CREATE INDEX idx_chats_customer_email ON chats(customer_email);
CREATE INDEX idx_chats_source ON chats(source);
CREATE INDEX idx_chats_priority ON chats(priority);
CREATE INDEX idx_chats_chat_type ON chats(chat_type);

-- Enable Row Level Security
ALTER TABLE chats ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Allow public to insert chats (for website chat widgets)
CREATE POLICY "Anyone can insert chats" ON chats
  FOR INSERT WITH CHECK (true);

-- Authenticated users can view all chats
CREATE POLICY "Authenticated users can view chats" ON chats
  FOR SELECT USING (auth.role() = 'authenticated');

-- Authenticated users can update chats
CREATE POLICY "Authenticated users can update chats" ON chats
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Authenticated users can delete chats
CREATE POLICY "Authenticated users can delete chats" ON chats
  FOR DELETE USING (auth.role() = 'authenticated');

-- Create updated_at trigger
CREATE TRIGGER update_chats_updated_at BEFORE UPDATE ON chats
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Add constraints
ALTER TABLE chats ADD CONSTRAINT valid_status 
  CHECK (status IN ('active', 'paused', 'closed', 'transferred', 'abandoned'));

ALTER TABLE chats ADD CONSTRAINT valid_priority 
  CHECK (priority IN ('low', 'normal', 'high', 'urgent'));

ALTER TABLE chats ADD CONSTRAINT valid_chat_type 
  CHECK (chat_type IN ('inbound', 'outbound', 'transfer', 'callback'));

ALTER TABLE chats ADD CONSTRAINT valid_phone_type 
  CHECK (phone_type IN ('mobile', 'landline', 'voip', 'unknown'));

ALTER TABLE chats ADD CONSTRAINT valid_sentiment 
  CHECK (customer_sentiment IN ('positive', 'neutral', 'negative', 'frustrated'));

ALTER TABLE chats ADD CONSTRAINT valid_intent 
  CHECK (customer_intent IN ('inquiry', 'complaint', 'support', 'sales', 'booking', 'general'));

ALTER TABLE chats ADD CONSTRAINT valid_urgency 
  CHECK (customer_urgency IN ('low', 'normal', 'high', 'urgent'));

ALTER TABLE chats ADD CONSTRAINT valid_resolution_status 
  CHECK (resolution_status IN ('resolved', 'unresolved', 'escalated', 'transferred'));

ALTER TABLE chats ADD CONSTRAINT valid_satisfaction_rating 
  CHECK (customer_satisfaction IS NULL OR (customer_satisfaction >= 1 AND customer_satisfaction <= 5));

ALTER TABLE chats ADD CONSTRAINT valid_agent_rating 
  CHECK (agent_rating IS NULL OR (agent_rating >= 1 AND agent_rating <= 5));

ALTER TABLE chats ADD CONSTRAINT valid_quality_score 
  CHECK (quality_score IS NULL OR (quality_score >= 0.00 AND quality_score <= 10.00));

-- Add comments for documentation
COMMENT ON TABLE chats IS 'Stores chat conversations, status, history, and phone information';
COMMENT ON COLUMN chats.lead_id IS 'Reference to the original lead that generated this chat';
COMMENT ON COLUMN chats.chat_session_id IS 'Unique session identifier for the chat';
COMMENT ON COLUMN chats.external_chat_id IS 'External system chat ID (e.g., from chat widget)';
COMMENT ON COLUMN chats.primary_phone IS 'Main phone number for the customer';
COMMENT ON COLUMN chats.secondary_phone IS 'Alternative phone number for the customer';
COMMENT ON COLUMN chats.phone_type IS 'Type of phone number (mobile, landline, voip, unknown)';
COMMENT ON COLUMN chats.agent_id IS 'Agent assigned to handle this chat';
COMMENT ON COLUMN chats.status IS 'Current status of the chat conversation';
COMMENT ON COLUMN chats.priority IS 'Priority level of the chat';
COMMENT ON COLUMN chats.chat_type IS 'Type of chat (inbound, outbound, transfer, callback)';
COMMENT ON COLUMN chats.chat_history IS 'JSON array of chat messages and interactions';
COMMENT ON COLUMN chats.customer_sentiment IS 'Detected customer sentiment during the chat';
COMMENT ON COLUMN chats.customer_intent IS 'Detected customer intent or purpose';
COMMENT ON COLUMN chats.resolution_status IS 'How the chat was resolved';
COMMENT ON COLUMN chats.customer_satisfaction IS 'Customer satisfaction rating (1-5)';
COMMENT ON COLUMN chats.agent_rating IS 'Agent performance rating (1-5)';
COMMENT ON COLUMN chats.quality_score IS 'Overall quality score (0.00-10.00)';
