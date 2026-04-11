-- Notification Preferences Table for Supabase
-- This table stores notification preferences for each business owner

-- Create notification_preferences table
CREATE TABLE notification_preferences (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  business_profile_id UUID REFERENCES business_profiles(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  
  -- Notification Types (boolean flags)
  appointment_booked BOOLEAN DEFAULT true,
  appointment_cancelled BOOLEAN DEFAULT true,
  appointment_rescheduled BOOLEAN DEFAULT true,
  appointment_reminder BOOLEAN DEFAULT false,
  
  missed_calls BOOLEAN DEFAULT true,
  new_voicemail BOOLEAN DEFAULT true,
  call_completed BOOLEAN DEFAULT false,
  call_failed BOOLEAN DEFAULT true,
  
  new_lead BOOLEAN DEFAULT true,
  lead_converted BOOLEAN DEFAULT true,
  lead_lost BOOLEAN DEFAULT false,
  
  sms_received BOOLEAN DEFAULT true,
  sms_failed BOOLEAN DEFAULT true,
  whatsapp_received BOOLEAN DEFAULT true,
  whatsapp_failed BOOLEAN DEFAULT true,
  
  payment_received BOOLEAN DEFAULT true,
  payment_failed BOOLEAN DEFAULT true,
  invoice_overdue BOOLEAN DEFAULT true,
  
  agent_offline BOOLEAN DEFAULT true,
  agent_error BOOLEAN DEFAULT true,
  system_maintenance BOOLEAN DEFAULT false,
  
  review_received BOOLEAN DEFAULT true,
  negative_review BOOLEAN DEFAULT true,
  
  -- Delivery Methods
  email_notifications BOOLEAN DEFAULT true,
  sms_notifications BOOLEAN DEFAULT false,
  push_notifications BOOLEAN DEFAULT true,
  in_app_notifications BOOLEAN DEFAULT true,
  
  -- Notification Timing
  instant_notifications BOOLEAN DEFAULT true,
  daily_digest BOOLEAN DEFAULT false,
  weekly_digest BOOLEAN DEFAULT false,
  
  -- Quiet Hours
  quiet_hours_enabled BOOLEAN DEFAULT false,
  quiet_hours_start TIME DEFAULT '22:00:00',
  quiet_hours_end TIME DEFAULT '08:00:00',
  quiet_hours_timezone VARCHAR(50) DEFAULT 'UTC',
  
  -- Weekend Settings
  weekend_notifications BOOLEAN DEFAULT true,
  
  -- Contact Information
  notification_email VARCHAR(255),
  notification_phone VARCHAR(20),
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id)
);

-- Create indexes for notification_preferences table
CREATE INDEX idx_notification_preferences_business_profile_id ON notification_preferences(business_profile_id);
CREATE INDEX idx_notification_preferences_user_id ON notification_preferences(user_id);
CREATE INDEX idx_notification_preferences_workspace_id ON notification_preferences(workspace_id);
CREATE INDEX idx_notification_preferences_created_at ON notification_preferences(created_at);

-- Enable RLS
ALTER TABLE notification_preferences ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for notification_preferences table
CREATE POLICY "Users can view their own notification preferences" ON notification_preferences
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own notification preferences" ON notification_preferences
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own notification preferences" ON notification_preferences
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own notification preferences" ON notification_preferences
  FOR DELETE USING (auth.uid() = user_id);

-- Create trigger for updated_at
CREATE TRIGGER update_notification_preferences_updated_at 
  BEFORE UPDATE ON notification_preferences
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create function to initialize default notification preferences for new users
CREATE OR REPLACE FUNCTION create_default_notification_preferences()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO notification_preferences (
    business_profile_id,
    user_id,
    workspace_id,
    created_by
  ) VALUES (
    NEW.id,
    NEW.user_id,
    NEW.workspace_id,
    NEW.user_id
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically create notification preferences when a business profile is created
CREATE TRIGGER create_notification_preferences_on_business_profile
  AFTER INSERT ON business_profiles
  FOR EACH ROW EXECUTE FUNCTION create_default_notification_preferences();

-- Create notification_logs table to track sent notifications
CREATE TABLE notification_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  notification_preferences_id UUID REFERENCES notification_preferences(id) ON DELETE CASCADE,
  business_profile_id UUID REFERENCES business_profiles(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Notification Details
  notification_type VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  
  -- Delivery Details
  delivery_method VARCHAR(20) NOT NULL, -- 'email', 'sms', 'push', 'in_app'
  recipient_email VARCHAR(255),
  recipient_phone VARCHAR(20),
  
  -- Status
  status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'sent', 'delivered', 'failed', 'read'
  sent_at TIMESTAMP WITH TIME ZONE,
  delivered_at TIMESTAMP WITH TIME ZONE,
  read_at TIMESTAMP WITH TIME ZONE,
  failed_at TIMESTAMP WITH TIME ZONE,
  error_message TEXT,
  
  -- Related Data
  related_entity_type VARCHAR(50), -- 'appointment', 'call', 'lead', etc.
  related_entity_id UUID,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for notification_logs table
CREATE INDEX idx_notification_logs_preferences_id ON notification_logs(notification_preferences_id);
CREATE INDEX idx_notification_logs_business_profile_id ON notification_logs(business_profile_id);
CREATE INDEX idx_notification_logs_user_id ON notification_logs(user_id);
CREATE INDEX idx_notification_logs_notification_type ON notification_logs(notification_type);
CREATE INDEX idx_notification_logs_status ON notification_logs(status);
CREATE INDEX idx_notification_logs_created_at ON notification_logs(created_at);
CREATE INDEX idx_notification_logs_related_entity ON notification_logs(related_entity_type, related_entity_id);

-- Enable RLS for notification_logs
ALTER TABLE notification_logs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for notification_logs table
CREATE POLICY "Users can view their own notification logs" ON notification_logs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can insert notification logs" ON notification_logs
  FOR INSERT WITH CHECK (true); -- Allow system to insert logs

CREATE POLICY "System can update notification logs" ON notification_logs
  FOR UPDATE USING (true); -- Allow system to update status

-- Create trigger for notification_logs updated_at
CREATE TRIGGER update_notification_logs_updated_at 
  BEFORE UPDATE ON notification_logs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
