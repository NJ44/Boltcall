-- Reminders Table for BoltCall
-- This table stores reminder messages, preferred times, and scheduling information for clients
-- Run this SQL in your Supabase SQL Editor

-- Create reminders table
CREATE TABLE reminders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  business_profile_id UUID NOT NULL REFERENCES business_profiles(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  
  -- Reminder message and content
  reminder_message TEXT NOT NULL,
  reminder_title VARCHAR(255),
  reminder_type VARCHAR(50) NOT NULL DEFAULT 'general', -- 'appointment', 'payment', 'follow_up', 'service', 'general', 'custom'
  
  -- Preferred/preferable time settings
  preferred_time TIME, -- Preferred time of day to send (e.g., '09:00:00', '14:30:00')
  preferred_timezone VARCHAR(50) DEFAULT 'UTC',
  preferred_day_of_week INTEGER[], -- Array of days (0=Sunday, 1=Monday, etc.) when reminder can be sent
  preferred_contact_method VARCHAR(20) DEFAULT 'sms', -- 'sms', 'email', 'phone', 'whatsapp', 'push'
  
  -- Scheduling information
  scheduled_date DATE NOT NULL, -- Date when reminder should be sent
  scheduled_time TIME NOT NULL, -- Specific time when reminder should be sent
  scheduled_datetime TIMESTAMP WITH TIME ZONE NOT NULL, -- Calculated datetime for scheduling
  timezone VARCHAR(50) DEFAULT 'UTC',
  
  -- Recurrence settings (optional)
  is_recurring BOOLEAN DEFAULT false,
  recurrence_pattern VARCHAR(50), -- 'daily', 'weekly', 'monthly', 'yearly', 'custom'
  recurrence_interval INTEGER DEFAULT 1, -- Every N days/weeks/months
  recurrence_end_date DATE, -- When to stop recurring
  recurrence_count INTEGER, -- Number of times to repeat (alternative to end_date)
  next_occurrence TIMESTAMP WITH TIME ZONE, -- Next scheduled occurrence for recurring reminders
  
  -- Reminder status and execution
  status VARCHAR(20) NOT NULL DEFAULT 'scheduled', -- 'scheduled', 'pending', 'sent', 'delivered', 'failed', 'cancelled', 'completed'
  priority VARCHAR(20) DEFAULT 'normal', -- 'low', 'normal', 'high', 'urgent'
  
  -- Execution tracking
  sent_at TIMESTAMP WITH TIME ZONE,
  delivered_at TIMESTAMP WITH TIME ZONE,
  read_at TIMESTAMP WITH TIME ZONE,
  failed_at TIMESTAMP WITH TIME ZONE,
  error_message TEXT,
  attempts_count INTEGER DEFAULT 0,
  max_attempts INTEGER DEFAULT 3,
  
  -- Response and interaction
  client_response VARCHAR(50), -- 'confirmed', 'cancelled', 'rescheduled', 'no_response', 'interested', 'not_interested'
  response_received_at TIMESTAMP WITH TIME ZONE,
  response_notes TEXT,
  
  -- Related information
  related_appointment_id UUID, -- If reminder is for an appointment
  related_service_id UUID, -- If reminder is for a service
  related_followup_id UUID REFERENCES post_service_followups(id) ON DELETE SET NULL,
  
  -- Template and customization
  template_id UUID, -- Reference to reminder template if used
  template_name VARCHAR(255),
  custom_fields JSONB DEFAULT '{}', -- Custom data for template personalization
  
  -- Automation and AI
  automated BOOLEAN DEFAULT false, -- Whether reminder was created automatically
  ai_generated BOOLEAN DEFAULT false, -- Whether message was AI-generated
  ai_optimized_time BOOLEAN DEFAULT false, -- Whether send time was AI-optimized
  
  -- Client preferences override
  use_client_preferences BOOLEAN DEFAULT true, -- Whether to use client's preferred contact method/time
  override_preferences BOOLEAN DEFAULT false, -- Whether to override client preferences for this reminder
  
  -- Metadata and notes
  internal_notes TEXT,
  tags TEXT[],
  metadata JSONB DEFAULT '{}',
  
  -- System tracking
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id)
);

-- Enable Row Level Security
ALTER TABLE reminders ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for reminders table
CREATE POLICY "Users can view own reminders" ON reminders
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own reminders" ON reminders
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reminders" ON reminders
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own reminders" ON reminders
  FOR DELETE USING (auth.uid() = user_id);

-- Create updated_at trigger
CREATE TRIGGER update_reminders_updated_at BEFORE UPDATE ON reminders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_reminders_business_profile_id ON reminders(business_profile_id);
CREATE INDEX idx_reminders_user_id ON reminders(user_id);
CREATE INDEX idx_reminders_workspace_id ON reminders(workspace_id);
CREATE INDEX idx_reminders_client_id ON reminders(client_id);
CREATE INDEX idx_reminders_scheduled_datetime ON reminders(scheduled_datetime);
CREATE INDEX idx_reminders_scheduled_date ON reminders(scheduled_date);
CREATE INDEX idx_reminders_status ON reminders(status);
CREATE INDEX idx_reminders_reminder_type ON reminders(reminder_type);
CREATE INDEX idx_reminders_priority ON reminders(priority);
CREATE INDEX idx_reminders_preferred_contact_method ON reminders(preferred_contact_method);
CREATE INDEX idx_reminders_is_recurring ON reminders(is_recurring);
CREATE INDEX idx_reminders_next_occurrence ON reminders(next_occurrence);
CREATE INDEX idx_reminders_created_at ON reminders(created_at);
CREATE INDEX idx_reminders_sent_at ON reminders(sent_at);
CREATE INDEX idx_reminders_related_appointment_id ON reminders(related_appointment_id);
CREATE INDEX idx_reminders_related_service_id ON reminders(related_service_id);
CREATE INDEX idx_reminders_related_followup_id ON reminders(related_followup_id);
CREATE INDEX idx_reminders_tags ON reminders USING GIN(tags);

-- Create index for finding reminders that need to be sent (pending/scheduled reminders)
CREATE INDEX idx_reminders_pending_send ON reminders(scheduled_datetime, status)
  WHERE status IN ('scheduled', 'pending') AND scheduled_datetime <= NOW() + INTERVAL '1 day';

-- Create index for recurring reminders
CREATE INDEX idx_reminders_recurring ON reminders(is_recurring, next_occurrence, status)
  WHERE is_recurring = true AND status IN ('scheduled', 'pending');

-- Add constraints
ALTER TABLE reminders ADD CONSTRAINT valid_status 
  CHECK (status IN ('scheduled', 'pending', 'sent', 'delivered', 'failed', 'cancelled', 'completed'));

ALTER TABLE reminders ADD CONSTRAINT valid_priority 
  CHECK (priority IN ('low', 'normal', 'high', 'urgent'));

ALTER TABLE reminders ADD CONSTRAINT valid_reminder_type 
  CHECK (reminder_type IN ('appointment', 'payment', 'follow_up', 'service', 'general', 'custom', 'maintenance', 'renewal', 'check_in'));

ALTER TABLE reminders ADD CONSTRAINT valid_preferred_contact_method 
  CHECK (preferred_contact_method IN ('sms', 'email', 'phone', 'whatsapp', 'push', 'in_app'));

ALTER TABLE reminders ADD CONSTRAINT valid_recurrence_pattern 
  CHECK (recurrence_pattern IS NULL OR recurrence_pattern IN ('daily', 'weekly', 'monthly', 'yearly', 'custom'));

ALTER TABLE reminders ADD CONSTRAINT valid_client_response 
  CHECK (client_response IS NULL OR client_response IN ('confirmed', 'cancelled', 'rescheduled', 'no_response', 'interested', 'not_interested', 'needs_followup'));

ALTER TABLE reminders ADD CONSTRAINT valid_day_of_week 
  CHECK (preferred_day_of_week IS NULL OR (
    array_length(preferred_day_of_week, 1) IS NULL OR
    (SELECT bool_and(day >= 0 AND day <= 6) FROM unnest(preferred_day_of_week) AS day)
  ));

-- Add constraint to ensure scheduled_datetime is set
ALTER TABLE reminders ADD CONSTRAINT valid_scheduled_datetime 
  CHECK (
    status IN ('cancelled', 'completed', 'failed') OR 
    scheduled_datetime IS NOT NULL
  );

-- Function to automatically calculate scheduled_datetime from scheduled_date and scheduled_time
CREATE OR REPLACE FUNCTION calculate_reminders_scheduled_datetime()
RETURNS TRIGGER AS $$
BEGIN
  -- If scheduled_date and scheduled_time are set, calculate scheduled_datetime
  IF NEW.scheduled_date IS NOT NULL AND NEW.scheduled_time IS NOT NULL THEN
    NEW.scheduled_datetime := (NEW.scheduled_date + NEW.scheduled_time)::TIMESTAMP WITH TIME ZONE;
    
    -- Apply timezone if specified
    IF NEW.timezone IS NOT NULL AND NEW.timezone != 'UTC' THEN
      NEW.scheduled_datetime := NEW.scheduled_datetime AT TIME ZONE NEW.timezone;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-calculate scheduled_datetime
CREATE TRIGGER calculate_reminders_scheduled_datetime
  BEFORE INSERT OR UPDATE OF scheduled_date, scheduled_time, timezone ON reminders
  FOR EACH ROW
  EXECUTE FUNCTION calculate_reminders_scheduled_datetime();

-- Function to handle recurring reminders (updates next_occurrence)
CREATE OR REPLACE FUNCTION update_recurring_reminder()
RETURNS TRIGGER AS $$
BEGIN
  -- If reminder is recurring and was just sent/completed, calculate next occurrence
  IF NEW.is_recurring = true AND NEW.status = 'sent' AND OLD.status != 'sent' THEN
    CASE NEW.recurrence_pattern
      WHEN 'daily' THEN
        NEW.next_occurrence := NEW.scheduled_datetime + (NEW.recurrence_interval || ' days')::INTERVAL;
      WHEN 'weekly' THEN
        NEW.next_occurrence := NEW.scheduled_datetime + (NEW.recurrence_interval || ' weeks')::INTERVAL;
      WHEN 'monthly' THEN
        NEW.next_occurrence := NEW.scheduled_datetime + (NEW.recurrence_interval || ' months')::INTERVAL;
      WHEN 'yearly' THEN
        NEW.next_occurrence := NEW.scheduled_datetime + (NEW.recurrence_interval || ' years')::INTERVAL;
      ELSE
        -- For custom patterns, next_occurrence should be set manually
        NULL;
    END CASE;
    
    -- Check if we've reached the end date or count limit
    IF (NEW.recurrence_end_date IS NOT NULL AND NEW.next_occurrence::DATE > NEW.recurrence_end_date) OR
       (NEW.recurrence_count IS NOT NULL AND NEW.attempts_count >= NEW.recurrence_count) THEN
      NEW.status := 'completed';
      NEW.is_recurring := false;
    ELSE
      -- Reset status for next occurrence
      NEW.status := 'scheduled';
      NEW.scheduled_datetime := NEW.next_occurrence;
      NEW.scheduled_date := NEW.next_occurrence::DATE;
      NEW.scheduled_time := NEW.next_occurrence::TIME;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for recurring reminders
CREATE TRIGGER update_recurring_reminders
  AFTER UPDATE OF status ON reminders
  FOR EACH ROW
  WHEN (NEW.is_recurring = true)
  EXECUTE FUNCTION update_recurring_reminder();

