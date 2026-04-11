-- Helper Functions for Notification Preferences

-- Function to get user's notification preferences
CREATE OR REPLACE FUNCTION get_user_notification_preferences(p_user_id UUID)
RETURNS TABLE (
  id UUID,
  appointment_booked BOOLEAN,
  appointment_cancelled BOOLEAN,
  appointment_rescheduled BOOLEAN,
  appointment_reminder BOOLEAN,
  missed_calls BOOLEAN,
  new_voicemail BOOLEAN,
  call_completed BOOLEAN,
  call_failed BOOLEAN,
  new_lead BOOLEAN,
  lead_converted BOOLEAN,
  lead_lost BOOLEAN,
  sms_received BOOLEAN,
  sms_failed BOOLEAN,
  whatsapp_received BOOLEAN,
  whatsapp_failed BOOLEAN,
  payment_received BOOLEAN,
  payment_failed BOOLEAN,
  invoice_overdue BOOLEAN,
  agent_offline BOOLEAN,
  agent_error BOOLEAN,
  system_maintenance BOOLEAN,
  review_received BOOLEAN,
  negative_review BOOLEAN,
  email_notifications BOOLEAN,
  sms_notifications BOOLEAN,
  push_notifications BOOLEAN,
  in_app_notifications BOOLEAN,
  instant_notifications BOOLEAN,
  daily_digest BOOLEAN,
  weekly_digest BOOLEAN,
  quiet_hours_enabled BOOLEAN,
  quiet_hours_start TIME,
  quiet_hours_end TIME,
  quiet_hours_timezone VARCHAR,
  weekend_notifications BOOLEAN,
  notification_email VARCHAR,
  notification_phone VARCHAR
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    np.id,
    np.appointment_booked,
    np.appointment_cancelled,
    np.appointment_rescheduled,
    np.appointment_reminder,
    np.missed_calls,
    np.new_voicemail,
    np.call_completed,
    np.call_failed,
    np.new_lead,
    np.lead_converted,
    np.lead_lost,
    np.sms_received,
    np.sms_failed,
    np.whatsapp_received,
    np.whatsapp_failed,
    np.payment_received,
    np.payment_failed,
    np.invoice_overdue,
    np.agent_offline,
    np.agent_error,
    np.system_maintenance,
    np.review_received,
    np.negative_review,
    np.email_notifications,
    np.sms_notifications,
    np.push_notifications,
    np.in_app_notifications,
    np.instant_notifications,
    np.daily_digest,
    np.weekly_digest,
    np.quiet_hours_enabled,
    np.quiet_hours_start,
    np.quiet_hours_end,
    np.quiet_hours_timezone,
    np.weekend_notifications,
    np.notification_email,
    np.notification_phone
  FROM notification_preferences np
  WHERE np.user_id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user should receive a specific notification
CREATE OR REPLACE FUNCTION should_send_notification(
  p_user_id UUID,
  p_notification_type VARCHAR,
  p_delivery_method VARCHAR DEFAULT 'in_app'
)
RETURNS BOOLEAN AS $$
DECLARE
  v_preferences RECORD;
  v_current_time TIME;
  v_current_day INTEGER;
  v_should_send BOOLEAN := false;
BEGIN
  -- Get user preferences
  SELECT * INTO v_preferences
  FROM notification_preferences
  WHERE user_id = p_user_id;
  
  -- If no preferences found, return false
  IF NOT FOUND THEN
    RETURN false;
  END IF;
  
  -- Check if delivery method is enabled
  CASE p_delivery_method
    WHEN 'email' THEN
      IF NOT v_preferences.email_notifications THEN
        RETURN false;
      END IF;
    WHEN 'sms' THEN
      IF NOT v_preferences.sms_notifications THEN
        RETURN false;
      END IF;
    WHEN 'push' THEN
      IF NOT v_preferences.push_notifications THEN
        RETURN false;
      END IF;
    WHEN 'in_app' THEN
      IF NOT v_preferences.in_app_notifications THEN
        RETURN false;
      END IF;
  END CASE;
  
  -- Check notification type preference
  CASE p_notification_type
    WHEN 'appointment_booked' THEN v_should_send := v_preferences.appointment_booked;
    WHEN 'appointment_cancelled' THEN v_should_send := v_preferences.appointment_cancelled;
    WHEN 'appointment_rescheduled' THEN v_should_send := v_preferences.appointment_rescheduled;
    WHEN 'appointment_reminder' THEN v_should_send := v_preferences.appointment_reminder;
    WHEN 'missed_calls' THEN v_should_send := v_preferences.missed_calls;
    WHEN 'new_voicemail' THEN v_should_send := v_preferences.new_voicemail;
    WHEN 'call_completed' THEN v_should_send := v_preferences.call_completed;
    WHEN 'call_failed' THEN v_should_send := v_preferences.call_failed;
    WHEN 'new_lead' THEN v_should_send := v_preferences.new_lead;
    WHEN 'lead_converted' THEN v_should_send := v_preferences.lead_converted;
    WHEN 'lead_lost' THEN v_should_send := v_preferences.lead_lost;
    WHEN 'sms_received' THEN v_should_send := v_preferences.sms_received;
    WHEN 'sms_failed' THEN v_should_send := v_preferences.sms_failed;
    WHEN 'whatsapp_received' THEN v_should_send := v_preferences.whatsapp_received;
    WHEN 'whatsapp_failed' THEN v_should_send := v_preferences.whatsapp_failed;
    WHEN 'payment_received' THEN v_should_send := v_preferences.payment_received;
    WHEN 'payment_failed' THEN v_should_send := v_preferences.payment_failed;
    WHEN 'invoice_overdue' THEN v_should_send := v_preferences.invoice_overdue;
    WHEN 'agent_offline' THEN v_should_send := v_preferences.agent_offline;
    WHEN 'agent_error' THEN v_should_send := v_preferences.agent_error;
    WHEN 'system_maintenance' THEN v_should_send := v_preferences.system_maintenance;
    WHEN 'review_received' THEN v_should_send := v_preferences.review_received;
    WHEN 'negative_review' THEN v_should_send := v_preferences.negative_review;
    ELSE v_should_send := false;
  END CASE;
  
  -- If notification type is disabled, return false
  IF NOT v_should_send THEN
    RETURN false;
  END IF;
  
  -- Check quiet hours
  IF v_preferences.quiet_hours_enabled THEN
    v_current_time := CURRENT_TIME AT TIME ZONE v_preferences.quiet_hours_timezone;
    
    -- Handle quiet hours that span midnight
    IF v_preferences.quiet_hours_start > v_preferences.quiet_hours_end THEN
      IF v_current_time >= v_preferences.quiet_hours_start OR v_current_time <= v_preferences.quiet_hours_end THEN
        RETURN false;
      END IF;
    ELSE
      IF v_current_time >= v_preferences.quiet_hours_start AND v_current_time <= v_preferences.quiet_hours_end THEN
        RETURN false;
      END IF;
    END IF;
  END IF;
  
  -- Check weekend notifications
  IF NOT v_preferences.weekend_notifications THEN
    v_current_day := EXTRACT(DOW FROM CURRENT_DATE);
    IF v_current_day = 0 OR v_current_day = 6 THEN -- Sunday = 0, Saturday = 6
      RETURN false;
    END IF;
  END IF;
  
  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to log a notification
CREATE OR REPLACE FUNCTION log_notification(
  p_user_id UUID,
  p_notification_type VARCHAR,
  p_title VARCHAR,
  p_message TEXT,
  p_delivery_method VARCHAR,
  p_recipient_email VARCHAR DEFAULT NULL,
  p_recipient_phone VARCHAR DEFAULT NULL,
  p_related_entity_type VARCHAR DEFAULT NULL,
  p_related_entity_id UUID DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  v_log_id UUID;
  v_preferences_id UUID;
  v_business_profile_id UUID;
BEGIN
  -- Get preferences and business profile ID
  SELECT np.id, np.business_profile_id
  INTO v_preferences_id, v_business_profile_id
  FROM notification_preferences np
  WHERE np.user_id = p_user_id;
  
  -- Insert notification log
  INSERT INTO notification_logs (
    notification_preferences_id,
    business_profile_id,
    user_id,
    notification_type,
    title,
    message,
    delivery_method,
    recipient_email,
    recipient_phone,
    related_entity_type,
    related_entity_id
  ) VALUES (
    v_preferences_id,
    v_business_profile_id,
    p_user_id,
    p_notification_type,
    p_title,
    p_message,
    p_delivery_method,
    p_recipient_email,
    p_recipient_phone,
    p_related_entity_type,
    p_related_entity_id
  ) RETURNING id INTO v_log_id;
  
  RETURN v_log_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update notification status
CREATE OR REPLACE FUNCTION update_notification_status(
  p_log_id UUID,
  p_status VARCHAR,
  p_error_message TEXT DEFAULT NULL
)
RETURNS BOOLEAN AS $$
BEGIN
  UPDATE notification_logs
  SET 
    status = p_status,
    error_message = p_error_message,
    sent_at = CASE WHEN p_status = 'sent' THEN NOW() ELSE sent_at END,
    delivered_at = CASE WHEN p_status = 'delivered' THEN NOW() ELSE delivered_at END,
    read_at = CASE WHEN p_status = 'read' THEN NOW() ELSE read_at END,
    failed_at = CASE WHEN p_status = 'failed' THEN NOW() ELSE failed_at END,
    updated_at = NOW()
  WHERE id = p_log_id;
  
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get notification statistics
CREATE OR REPLACE FUNCTION get_notification_stats(p_user_id UUID, p_days INTEGER DEFAULT 30)
RETURNS TABLE (
  total_notifications BIGINT,
  sent_notifications BIGINT,
  delivered_notifications BIGINT,
  failed_notifications BIGINT,
  read_notifications BIGINT,
  email_notifications BIGINT,
  sms_notifications BIGINT,
  push_notifications BIGINT,
  in_app_notifications BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*) as total_notifications,
    COUNT(*) FILTER (WHERE status = 'sent') as sent_notifications,
    COUNT(*) FILTER (WHERE status = 'delivered') as delivered_notifications,
    COUNT(*) FILTER (WHERE status = 'failed') as failed_notifications,
    COUNT(*) FILTER (WHERE status = 'read') as read_notifications,
    COUNT(*) FILTER (WHERE delivery_method = 'email') as email_notifications,
    COUNT(*) FILTER (WHERE delivery_method = 'sms') as sms_notifications,
    COUNT(*) FILTER (WHERE delivery_method = 'push') as push_notifications,
    COUNT(*) FILTER (WHERE delivery_method = 'in_app') as in_app_notifications
  FROM notification_logs
  WHERE user_id = p_user_id
    AND created_at >= NOW() - INTERVAL '1 day' * p_days;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
