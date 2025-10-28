-- Cal.com API Integration Setup
-- Helper functions and views for managing Cal.com API keys and calendar integrations

-- Function to verify Cal.com API key
CREATE OR REPLACE FUNCTION verify_calcom_api_key(
  p_api_key_id UUID
) RETURNS BOOLEAN AS $$
DECLARE
  api_key_record RECORD;
  verification_result BOOLEAN := false;
BEGIN
  -- Get API key record
  SELECT * INTO api_key_record FROM calcom_api_keys WHERE id = p_api_key_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'API key not found with id: %', p_api_key_id;
  END IF;
  
  -- In a real implementation, this would make an API call to Cal.com
  -- For now, we'll simulate verification
  verification_result := true;
  
  -- Update verification status
  UPDATE calcom_api_keys 
  SET 
    is_verified = verification_result,
    last_verified_at = NOW(),
    verification_error = CASE WHEN verification_result THEN NULL ELSE 'Verification failed' END,
    updated_at = NOW()
  WHERE id = p_api_key_id;
  
  RETURN verification_result;
END;
$$ LANGUAGE plpgsql;

-- Function to sync event types from Cal.com
CREATE OR REPLACE FUNCTION sync_calcom_event_types(
  p_api_key_id UUID
) RETURNS INTEGER AS $$
DECLARE
  api_key_record RECORD;
  synced_count INTEGER := 0;
BEGIN
  -- Get API key record
  SELECT * INTO api_key_record FROM calcom_api_keys WHERE id = p_api_key_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'API key not found with id: %', p_api_key_id;
  END IF;
  
  -- Update sync status
  UPDATE calcom_api_keys 
  SET 
    sync_status = 'syncing',
    last_sync_at = NOW(),
    updated_at = NOW()
  WHERE id = p_api_key_id;
  
  -- In a real implementation, this would:
  -- 1. Make API call to Cal.com to get event types
  -- 2. Insert/update event types in calcom_event_types table
  -- 3. Return count of synced event types
  
  -- For now, we'll simulate successful sync
  UPDATE calcom_api_keys 
  SET 
    sync_status = 'completed',
    sync_error = NULL,
    updated_at = NOW()
  WHERE id = p_api_key_id;
  
  RETURN synced_count;
END;
$$ LANGUAGE plpgsql;

-- Function to get API key usage statistics
CREATE OR REPLACE FUNCTION get_calcom_api_usage_stats(
  p_user_id UUID,
  p_api_key_id UUID DEFAULT NULL
) RETURNS TABLE (
  api_key_id UUID,
  api_key_name VARCHAR(255),
  total_requests INTEGER,
  monthly_requests INTEGER,
  last_used_at TIMESTAMP WITH TIME ZONE,
  status VARCHAR(20),
  usage_percentage DECIMAL(5,2)
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    cak.id,
    cak.api_key_name,
    cak.total_requests,
    cak.monthly_requests,
    cak.last_used_at,
    cak.status,
    CASE 
      WHEN cak.rate_limit_per_day > 0 THEN 
        (cak.current_day_requests * 100.0 / cak.rate_limit_per_day)
      ELSE 0 
    END as usage_percentage
  FROM calcom_api_keys cak
  WHERE cak.user_id = p_user_id
    AND (p_api_key_id IS NULL OR cak.id = p_api_key_id)
  ORDER BY cak.created_at DESC;
END;
$$ LANGUAGE plpgsql;

-- Function to get upcoming bookings
CREATE OR REPLACE FUNCTION get_upcoming_calcom_bookings(
  p_user_id UUID,
  p_days_ahead INTEGER DEFAULT 7
) RETURNS TABLE (
  booking_id UUID,
  calcom_booking_id VARCHAR(100),
  title VARCHAR(255),
  start_time TIMESTAMP WITH TIME ZONE,
  end_time TIMESTAMP WITH TIME ZONE,
  attendee_count INTEGER,
  status VARCHAR(50),
  api_key_name VARCHAR(255)
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    cb.id,
    cb.calcom_booking_id,
    cb.title,
    cb.start_time,
    cb.end_time,
    jsonb_array_length(cb.attendees) as attendee_count,
    cb.status,
    cak.api_key_name
  FROM calcom_bookings cb
  JOIN calcom_api_keys cak ON cb.calcom_api_key_id = cak.id
  WHERE cb.user_id = p_user_id
    AND cb.start_time >= NOW()
    AND cb.start_time <= NOW() + (p_days_ahead || ' days')::INTERVAL
    AND cb.status IN ('confirmed', 'rescheduled')
  ORDER BY cb.start_time ASC;
END;
$$ LANGUAGE plpgsql;

-- Function to create webhook for Cal.com events
CREATE OR REPLACE FUNCTION setup_calcom_webhook(
  p_api_key_id UUID,
  p_webhook_url VARCHAR(500),
  p_events TEXT[] DEFAULT ARRAY['booking.created', 'booking.cancelled', 'booking.rescheduled']
) RETURNS BOOLEAN AS $$
DECLARE
  webhook_secret VARCHAR(255);
BEGIN
  -- Generate webhook secret
  webhook_secret := encode(gen_random_bytes(32), 'hex');
  
  -- Update API key with webhook configuration
  UPDATE calcom_api_keys 
  SET 
    webhook_url = p_webhook_url,
    webhook_secret = webhook_secret,
    webhook_events = p_events,
    webhook_active = true,
    updated_at = NOW()
  WHERE id = p_api_key_id;
  
  -- In a real implementation, this would make an API call to Cal.com
  -- to register the webhook endpoint
  
  RETURN true;
END;
$$ LANGUAGE plpgsql;

-- Function to encrypt API key (placeholder - use proper encryption in production)
CREATE OR REPLACE FUNCTION encrypt_api_key(
  p_api_key TEXT
) RETURNS VARCHAR(255) AS $$
BEGIN
  -- In production, use proper encryption like pgcrypto
  -- This is a simple hash for demonstration
  RETURN encode(digest(p_api_key || 'salt', 'sha256'), 'hex');
END;
$$ LANGUAGE plpgsql;

-- Function to add new Cal.com API key
CREATE OR REPLACE FUNCTION add_calcom_api_key(
  p_user_id UUID,
  p_business_profile_id UUID,
  p_api_key_name VARCHAR(255),
  p_api_key TEXT,
  p_cal_email VARCHAR(255) DEFAULT NULL
) RETURNS UUID AS $$
DECLARE
  new_api_key_id UUID;
  encrypted_key VARCHAR(255);
BEGIN
  -- Encrypt the API key
  encrypted_key := encrypt_api_key(p_api_key);
  
  -- Insert new API key
  INSERT INTO calcom_api_keys (
    business_profile_id,
    user_id,
    api_key_name,
    api_key_hash,
    cal_email,
    status,
    created_by
  ) VALUES (
    p_business_profile_id,
    p_user_id,
    p_api_key_name,
    encrypted_key,
    p_cal_email,
    'active',
    p_user_id
  ) RETURNING id INTO new_api_key_id;
  
  -- Verify the API key
  PERFORM verify_calcom_api_key(new_api_key_id);
  
  RETURN new_api_key_id;
END;
$$ LANGUAGE plpgsql;

-- View for Cal.com dashboard overview
CREATE OR REPLACE VIEW calcom_dashboard_overview AS
SELECT 
  cak.id as api_key_id,
  cak.api_key_name,
  cak.cal_email,
  cak.status,
  cak.is_verified,
  cak.last_used_at,
  cak.total_requests,
  cak.monthly_requests,
  COUNT(DISTINCT cet.id) as event_types_count,
  COUNT(DISTINCT cb.id) as total_bookings,
  COUNT(DISTINCT CASE WHEN cb.start_time >= NOW() THEN cb.id END) as upcoming_bookings,
  COALESCE(AVG(CASE WHEN cb.payment_amount > 0 THEN cb.payment_amount END), 0) as avg_booking_value,
  cak.sync_status,
  cak.last_sync_at
FROM calcom_api_keys cak
LEFT JOIN calcom_event_types cet ON cak.id = cet.calcom_api_key_id AND cet.is_enabled = true
LEFT JOIN calcom_bookings cb ON cak.id = cb.calcom_api_key_id
GROUP BY cak.id, cak.api_key_name, cak.cal_email, cak.status, cak.is_verified, 
         cak.last_used_at, cak.total_requests, cak.monthly_requests, 
         cak.sync_status, cak.last_sync_at;

-- View for booking analytics
CREATE OR REPLACE VIEW calcom_booking_analytics AS
SELECT 
  cb.calcom_api_key_id,
  DATE_TRUNC('month', cb.start_time) as booking_month,
  COUNT(*) as total_bookings,
  COUNT(CASE WHEN cb.status = 'confirmed' THEN 1 END) as confirmed_bookings,
  COUNT(CASE WHEN cb.status = 'cancelled' THEN 1 END) as cancelled_bookings,
  COUNT(CASE WHEN cb.status = 'no_show' THEN 1 END) as no_show_bookings,
  COALESCE(SUM(cb.payment_amount), 0) as total_revenue,
  COALESCE(AVG(cb.payment_amount), 0) as avg_booking_value,
  COUNT(DISTINCT cb.client_id) as unique_clients
FROM calcom_bookings cb
WHERE cb.start_time >= NOW() - INTERVAL '12 months'
GROUP BY cb.calcom_api_key_id, DATE_TRUNC('month', cb.start_time)
ORDER BY cb.calcom_api_key_id, booking_month DESC;

-- View for event type performance
CREATE OR REPLACE VIEW calcom_event_type_performance AS
SELECT 
  cet.id as event_type_id,
  cet.calcom_api_key_id,
  cet.title,
  cet.length,
  cet.price,
  COUNT(cb.id) as total_bookings,
  COUNT(CASE WHEN cb.status = 'confirmed' THEN 1 END) as confirmed_bookings,
  COALESCE(SUM(cb.payment_amount), 0) as total_revenue,
  COALESCE(AVG(cb.payment_amount), 0) as avg_revenue_per_booking,
  COUNT(DISTINCT cb.client_id) as unique_clients,
  cet.is_enabled,
  cet.last_synced_at
FROM calcom_event_types cet
LEFT JOIN calcom_bookings cb ON cet.id = cb.calcom_event_type_id
GROUP BY cet.id, cet.calcom_api_key_id, cet.title, cet.length, cet.price, 
         cet.is_enabled, cet.last_synced_at
ORDER BY total_bookings DESC;

-- Sample data insertion function
CREATE OR REPLACE FUNCTION insert_sample_calcom_data(
  p_user_id UUID,
  p_business_profile_id UUID
) RETURNS VOID AS $$
DECLARE
  sample_api_key_id UUID;
  sample_event_type_id UUID;
BEGIN
  -- Insert sample API key
  INSERT INTO calcom_api_keys (
    business_profile_id, user_id, api_key_name, api_key_hash, cal_email,
    cal_username, status, is_verified, created_by
  ) VALUES (
    p_business_profile_id, p_user_id, 'Main Calendar', 
    'hashed_api_key_placeholder', 'user@example.com',
    'username', 'active', true, p_user_id
  ) RETURNING id INTO sample_api_key_id;
  
  -- Insert sample event types
  INSERT INTO calcom_event_types (
    calcom_api_key_id, business_profile_id, user_id, calcom_event_type_id,
    title, slug, description, length, price
  ) VALUES 
    (sample_api_key_id, p_business_profile_id, p_user_id, 'et_consultation', 
     'Consultation Call', 'consultation', 'Initial consultation meeting', 30, 0.00),
    (sample_api_key_id, p_business_profile_id, p_user_id, 'et_strategy', 
     'Strategy Session', 'strategy', 'Deep dive strategy session', 60, 150.00),
    (sample_api_key_id, p_business_profile_id, p_user_id, 'et_followup', 
     'Follow-up Meeting', 'followup', 'Follow-up discussion', 15, 0.00);
  
  -- Get first event type for sample booking
  SELECT id INTO sample_event_type_id 
  FROM calcom_event_types 
  WHERE calcom_api_key_id = sample_api_key_id 
  LIMIT 1;
  
  -- Insert sample bookings
  INSERT INTO calcom_bookings (
    calcom_api_key_id, calcom_event_type_id, business_profile_id, user_id,
    calcom_booking_id, title, start_time, end_time, timezone, status
  ) VALUES 
    (sample_api_key_id, sample_event_type_id, p_business_profile_id, p_user_id,
     'booking_001', 'Consultation with John Doe', 
     NOW() + INTERVAL '1 day', NOW() + INTERVAL '1 day 30 minutes', 
     'America/New_York', 'confirmed'),
    (sample_api_key_id, sample_event_type_id, p_business_profile_id, p_user_id,
     'booking_002', 'Strategy Session with Jane Smith', 
     NOW() + INTERVAL '3 days', NOW() + INTERVAL '3 days 1 hour', 
     'America/New_York', 'confirmed');
END;
$$ LANGUAGE plpgsql;

-- Cleanup function for old data
CREATE OR REPLACE FUNCTION cleanup_old_calcom_data(
  p_days_old INTEGER DEFAULT 365
) RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  -- Delete old bookings
  DELETE FROM calcom_bookings 
  WHERE created_at < NOW() - (p_days_old || ' days')::INTERVAL
    AND status IN ('cancelled', 'no_show');
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;
