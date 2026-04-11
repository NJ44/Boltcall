-- Callbacks Table for BoltCall
-- This table stores callback requests from clients who want to be called back
-- Run this SQL in your Supabase SQL Editor

-- Create callbacks table
CREATE TABLE callbacks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
  
  -- Client information (can be different from lead if they want callback for different person)
  client_name TEXT NOT NULL,
  client_phone TEXT NOT NULL,
  client_email TEXT,
  company_name TEXT,
  
  -- Callback details
  preferred_callback_time TIMESTAMP WITH TIME ZONE,
  preferred_time_range VARCHAR(50), -- 'morning', 'afternoon', 'evening', 'anytime'
  timezone VARCHAR(50) DEFAULT 'UTC',
  urgency VARCHAR(20) DEFAULT 'normal', -- 'urgent', 'normal', 'low'
  
  -- Callback status
  status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'scheduled', 'completed', 'cancelled', 'no_answer'
  priority INTEGER DEFAULT 5, -- 1-10 scale, 1 being highest priority
  
  -- Callback notes and context
  callback_reason TEXT,
  notes TEXT,
  special_instructions TEXT,
  
  -- Callback scheduling
  scheduled_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  attempted_at TIMESTAMP WITH TIME ZONE,
  attempt_count INTEGER DEFAULT 0,
  
  -- Callback outcome
  outcome VARCHAR(50), -- 'successful', 'no_answer', 'busy', 'wrong_number', 'callback_requested', 'not_interested'
  outcome_notes TEXT,
  follow_up_required BOOLEAN DEFAULT false,
  follow_up_date TIMESTAMP WITH TIME ZONE,
  
  -- Agent information
  assigned_agent_id UUID REFERENCES auth.users(id),
  agent_notes TEXT,
  
  -- Source tracking
  source VARCHAR(100), -- 'website', 'phone_call', 'email', 'chat', 'referral'
  source_details TEXT,
  
  -- Metadata
  tags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_callbacks_lead_id ON callbacks(lead_id);
CREATE INDEX idx_callbacks_status ON callbacks(status);
CREATE INDEX idx_callbacks_scheduled_at ON callbacks(scheduled_at);
CREATE INDEX idx_callbacks_created_at ON callbacks(created_at);
CREATE INDEX idx_callbacks_assigned_agent ON callbacks(assigned_agent_id);

-- Enable Row Level Security
ALTER TABLE callbacks ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Allow public to insert callbacks (for website forms)
CREATE POLICY "Anyone can insert callbacks" ON callbacks
  FOR INSERT WITH CHECK (true);

-- Authenticated users can view all callbacks
CREATE POLICY "Authenticated users can view callbacks" ON callbacks
  FOR SELECT USING (auth.role() = 'authenticated');

-- Authenticated users can update callbacks
CREATE POLICY "Authenticated users can update callbacks" ON callbacks
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Authenticated users can delete callbacks
CREATE POLICY "Authenticated users can delete callbacks" ON callbacks
  FOR DELETE USING (auth.role() = 'authenticated');

-- Create updated_at trigger
CREATE TRIGGER update_callbacks_updated_at BEFORE UPDATE ON callbacks
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Add constraints
ALTER TABLE callbacks ADD CONSTRAINT valid_status 
  CHECK (status IN ('pending', 'scheduled', 'completed', 'cancelled', 'no_answer'));

ALTER TABLE callbacks ADD CONSTRAINT valid_urgency 
  CHECK (urgency IN ('urgent', 'normal', 'low'));

ALTER TABLE callbacks ADD CONSTRAINT valid_priority 
  CHECK (priority >= 1 AND priority <= 10);

ALTER TABLE callbacks ADD CONSTRAINT valid_outcome 
  CHECK (outcome IN ('successful', 'no_answer', 'busy', 'wrong_number', 'callback_requested', 'not_interested', 'voicemail', 'callback_scheduled'));

ALTER TABLE callbacks ADD CONSTRAINT valid_time_range 
  CHECK (preferred_time_range IN ('morning', 'afternoon', 'evening', 'anytime'));

-- Add comments for documentation
COMMENT ON TABLE callbacks IS 'Stores callback requests from clients who want to be called back';
COMMENT ON COLUMN callbacks.lead_id IS 'Reference to the original lead that generated this callback request';
COMMENT ON COLUMN callbacks.client_name IS 'Name of the person requesting the callback';
COMMENT ON COLUMN callbacks.client_phone IS 'Phone number to call back';
COMMENT ON COLUMN callbacks.preferred_callback_time IS 'Specific time when client prefers to be called';
COMMENT ON COLUMN callbacks.preferred_time_range IS 'General time range preference (morning, afternoon, evening, anytime)';
COMMENT ON COLUMN callbacks.status IS 'Current status of the callback request';
COMMENT ON COLUMN callbacks.priority IS 'Priority level from 1 (highest) to 10 (lowest)';
COMMENT ON COLUMN callbacks.attempt_count IS 'Number of times callback has been attempted';
COMMENT ON COLUMN callbacks.outcome IS 'Result of the callback attempt';
COMMENT ON COLUMN callbacks.assigned_agent_id IS 'Agent assigned to handle this callback';
