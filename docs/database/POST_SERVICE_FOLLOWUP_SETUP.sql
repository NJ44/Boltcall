-- Post Service Follow-up System Setup
-- Additional functions and sample data for the post service follow-up system

-- Function to automatically create follow-up tasks after service completion
CREATE OR REPLACE FUNCTION create_automatic_followup(
  p_client_id UUID,
  p_service_type VARCHAR(100),
  p_service_date TIMESTAMP WITH TIME ZONE,
  p_service_description TEXT DEFAULT NULL,
  p_service_cost DECIMAL(10,2) DEFAULT NULL,
  p_technician_name VARCHAR(100) DEFAULT NULL
) RETURNS UUID AS $$
DECLARE
  followup_id UUID;
  client_record RECORD;
BEGIN
  -- Get client information
  SELECT * INTO client_record FROM clients WHERE id = p_client_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Client not found with id: %', p_client_id;
  END IF;
  
  -- Create satisfaction follow-up (24 hours after service)
  INSERT INTO post_service_followups (
    business_profile_id,
    user_id,
    workspace_id,
    client_id,
    service_type,
    service_date,
    service_description,
    service_cost,
    technician_name,
    followup_type,
    scheduled_date,
    due_date,
    priority,
    contact_method,
    status,
    created_by
  ) VALUES (
    client_record.business_profile_id,
    client_record.user_id,
    client_record.workspace_id,
    p_client_id,
    p_service_type,
    p_service_date,
    p_service_description,
    p_service_cost,
    p_technician_name,
    'satisfaction',
    p_service_date + INTERVAL '24 hours',
    p_service_date + INTERVAL '72 hours',
    'medium',
    client_record.preferred_contact_method,
    'scheduled',
    client_record.user_id
  ) RETURNING id INTO followup_id;
  
  -- Update client's service history
  UPDATE clients 
  SET 
    total_services = total_services + 1,
    last_service_date = p_service_date,
    lifetime_value = COALESCE(lifetime_value, 0) + COALESCE(p_service_cost, 0),
    updated_at = NOW()
  WHERE id = p_client_id;
  
  RETURN followup_id;
END;
$$ LANGUAGE plpgsql;

-- Function to get overdue follow-ups
CREATE OR REPLACE FUNCTION get_overdue_followups(
  p_user_id UUID,
  p_business_profile_id UUID DEFAULT NULL
) RETURNS TABLE (
  followup_id UUID,
  client_name TEXT,
  client_phone VARCHAR(20),
  client_email VARCHAR(255),
  service_type VARCHAR(100),
  service_date TIMESTAMP WITH TIME ZONE,
  followup_type VARCHAR(50),
  scheduled_date TIMESTAMP WITH TIME ZONE,
  days_overdue INTEGER,
  priority VARCHAR(20)
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    psf.id,
    CONCAT(c.first_name, ' ', c.last_name),
    c.phone,
    c.email,
    psf.service_type,
    psf.service_date,
    psf.followup_type,
    psf.scheduled_date,
    EXTRACT(DAY FROM NOW() - psf.scheduled_date)::INTEGER,
    psf.priority
  FROM post_service_followups psf
  JOIN clients c ON psf.client_id = c.id
  WHERE psf.user_id = p_user_id
    AND (p_business_profile_id IS NULL OR psf.business_profile_id = p_business_profile_id)
    AND psf.status = 'scheduled'
    AND psf.scheduled_date < NOW()
  ORDER BY psf.scheduled_date ASC;
END;
$$ LANGUAGE plpgsql;

-- Function to get follow-up statistics
CREATE OR REPLACE FUNCTION get_followup_stats(
  p_user_id UUID,
  p_business_profile_id UUID DEFAULT NULL,
  p_date_from TIMESTAMP WITH TIME ZONE DEFAULT NOW() - INTERVAL '30 days',
  p_date_to TIMESTAMP WITH TIME ZONE DEFAULT NOW()
) RETURNS TABLE (
  total_followups INTEGER,
  completed_followups INTEGER,
  overdue_followups INTEGER,
  avg_satisfaction_rating DECIMAL(3,2),
  completion_rate DECIMAL(5,2)
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*)::INTEGER as total_followups,
    COUNT(CASE WHEN status = 'completed' THEN 1 END)::INTEGER as completed_followups,
    COUNT(CASE WHEN status = 'scheduled' AND scheduled_date < NOW() THEN 1 END)::INTEGER as overdue_followups,
    AVG(satisfaction_rating) as avg_satisfaction_rating,
    CASE 
      WHEN COUNT(*) > 0 THEN 
        (COUNT(CASE WHEN status = 'completed' THEN 1 END) * 100.0 / COUNT(*))
      ELSE 0 
    END as completion_rate
  FROM post_service_followups
  WHERE user_id = p_user_id
    AND (p_business_profile_id IS NULL OR business_profile_id = p_business_profile_id)
    AND created_at BETWEEN p_date_from AND p_date_to;
END;
$$ LANGUAGE plpgsql;

-- Function to schedule maintenance follow-up
CREATE OR REPLACE FUNCTION schedule_maintenance_followup(
  p_client_id UUID,
  p_service_type VARCHAR(100),
  p_months_ahead INTEGER DEFAULT 6
) RETURNS UUID AS $$
DECLARE
  followup_id UUID;
  client_record RECORD;
BEGIN
  -- Get client information
  SELECT * INTO client_record FROM clients WHERE id = p_client_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Client not found with id: %', p_client_id;
  END IF;
  
  -- Create maintenance follow-up
  INSERT INTO post_service_followups (
    business_profile_id,
    user_id,
    workspace_id,
    client_id,
    service_type,
    service_date,
    followup_type,
    scheduled_date,
    due_date,
    priority,
    contact_method,
    status,
    custom_message,
    created_by
  ) VALUES (
    client_record.business_profile_id,
    client_record.user_id,
    client_record.workspace_id,
    p_client_id,
    p_service_type,
    client_record.last_service_date,
    'maintenance',
    NOW() + (p_months_ahead || ' months')::INTERVAL,
    NOW() + (p_months_ahead || ' months')::INTERVAL + INTERVAL '7 days',
    'medium',
    client_record.preferred_contact_method,
    'scheduled',
    'Time for your regular ' || p_service_type || ' maintenance check-up!',
    client_record.user_id
  ) RETURNING id INTO followup_id;
  
  -- Update client's next service due date
  UPDATE clients 
  SET 
    next_service_due = NOW() + (p_months_ahead || ' months')::INTERVAL,
    updated_at = NOW()
  WHERE id = p_client_id;
  
  RETURN followup_id;
END;
$$ LANGUAGE plpgsql;

-- Sample data insertion (uncomment to use)
/*
-- Sample clients
INSERT INTO clients (
  business_profile_id, user_id, first_name, last_name, email, phone,
  preferred_contact_method, status, acquisition_source
) VALUES 
  -- Replace with actual business_profile_id and user_id
  ('your-business-profile-id', 'your-user-id', 'John', 'Smith', 'john.smith@email.com', '+1234567890', 'phone', 'active', 'website'),
  ('your-business-profile-id', 'your-user-id', 'Sarah', 'Johnson', 'sarah.j@email.com', '+1234567891', 'email', 'active', 'referral'),
  ('your-business-profile-id', 'your-user-id', 'Mike', 'Davis', 'mike.davis@email.com', '+1234567892', 'sms', 'active', 'advertisement');

-- Sample follow-ups
INSERT INTO post_service_followups (
  business_profile_id, user_id, client_id, service_type, service_date,
  followup_type, scheduled_date, priority, contact_method, status
) VALUES 
  -- Replace with actual IDs
  ('your-business-profile-id', 'your-user-id', 'client-id-1', 'HVAC Maintenance', NOW() - INTERVAL '2 days', 'satisfaction', NOW() - INTERVAL '1 day', 'medium', 'phone', 'scheduled'),
  ('your-business-profile-id', 'your-user-id', 'client-id-2', 'AC Repair', NOW() - INTERVAL '1 week', 'satisfaction', NOW() - INTERVAL '6 days', 'high', 'email', 'completed'),
  ('your-business-profile-id', 'your-user-id', 'client-id-3', 'Furnace Installation', NOW() - INTERVAL '3 months', 'maintenance', NOW() + INTERVAL '3 months', 'medium', 'phone', 'scheduled');
*/

-- Views for easier data access
CREATE OR REPLACE VIEW followup_dashboard AS
SELECT 
  psf.id,
  psf.service_type,
  psf.service_date,
  psf.followup_type,
  psf.scheduled_date,
  psf.status,
  psf.priority,
  psf.contact_method,
  psf.satisfaction_rating,
  CONCAT(c.first_name, ' ', c.last_name) as client_name,
  c.phone as client_phone,
  c.email as client_email,
  c.preferred_contact_method as client_preferred_contact,
  CASE 
    WHEN psf.status = 'scheduled' AND psf.scheduled_date < NOW() THEN 'overdue'
    WHEN psf.status = 'scheduled' AND psf.scheduled_date <= NOW() + INTERVAL '24 hours' THEN 'due_soon'
    ELSE psf.status
  END as urgency_status,
  EXTRACT(DAY FROM NOW() - psf.scheduled_date) as days_since_scheduled
FROM post_service_followups psf
JOIN clients c ON psf.client_id = c.id;

-- View for client service history
CREATE OR REPLACE VIEW client_service_history AS
SELECT 
  c.id as client_id,
  CONCAT(c.first_name, ' ', c.last_name) as client_name,
  c.email,
  c.phone,
  c.total_services,
  c.last_service_date,
  c.next_service_due,
  c.lifetime_value,
  COUNT(psf.id) as total_followups,
  COUNT(CASE WHEN psf.status = 'completed' THEN 1 END) as completed_followups,
  AVG(psf.satisfaction_rating) as avg_satisfaction_rating,
  MAX(psf.service_date) as most_recent_service
FROM clients c
LEFT JOIN post_service_followups psf ON c.id = psf.client_id
GROUP BY c.id, c.first_name, c.last_name, c.email, c.phone, 
         c.total_services, c.last_service_date, c.next_service_due, c.lifetime_value;
