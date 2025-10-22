-- Business Profiles and Workspaces Tables for BoltCall
-- Run these SQL commands in your Supabase SQL Editor

-- First, create the update_updated_at_column function if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create workspaces table
CREATE TABLE workspaces (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add unique constraint for user_id + name combination to prevent duplicate business names per user
ALTER TABLE workspaces ADD CONSTRAINT unique_user_business_name UNIQUE (user_id, name);

-- Create business_profiles table
CREATE TABLE business_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  business_name TEXT NOT NULL,
  website_url TEXT,
  main_category TEXT NOT NULL,
  country TEXT NOT NULL,
  service_areas TEXT[] DEFAULT '{}',
  opening_hours JSONB DEFAULT '{}',
  languages TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_profiles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for workspaces
CREATE POLICY "Users can view own workspaces" ON workspaces
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own workspaces" ON workspaces
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own workspaces" ON workspaces
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own workspaces" ON workspaces
  FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for business_profiles
CREATE POLICY "Users can view own business profiles" ON business_profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own business profiles" ON business_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own business profiles" ON business_profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own business profiles" ON business_profiles
  FOR DELETE USING (auth.uid() = user_id);

-- Create updated_at triggers
CREATE TRIGGER update_workspaces_updated_at BEFORE UPDATE ON workspaces
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_business_profiles_updated_at BEFORE UPDATE ON business_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create voices table for Retell AI voices
CREATE TABLE voices (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  accent TEXT NOT NULL,
  gender TEXT NOT NULL,
  preview_audio_url TEXT NOT NULL,
  provider TEXT DEFAULT 'retell',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security for voices table
ALTER TABLE voices ENABLE ROW LEVEL SECURITY;

-- Create RLS policy for voices (public read access)
CREATE POLICY "Anyone can view voices" ON voices
  FOR SELECT USING (is_active = true);

-- Create updated_at trigger for voices
CREATE TRIGGER update_voices_updated_at BEFORE UPDATE ON voices
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create retell_llms table for Retell AI LLM configurations
CREATE TABLE retell_llms (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  industry TEXT NOT NULL, -- e.g., 'dentist', 'hvac', 'legal', etc.
  llm_config JSONB NOT NULL, -- Retell LLM configuration object
  voice_id TEXT REFERENCES voices(id),
  is_active BOOLEAN DEFAULT true,
  is_public BOOLEAN DEFAULT false, -- Allow sharing with other users
  usage_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security for retell_llms table
ALTER TABLE retell_llms ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for retell_llms
CREATE POLICY "Users can view own LLMs" ON retell_llms
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view public LLMs" ON retell_llms
  FOR SELECT USING (is_public = true);

CREATE POLICY "Users can insert own LLMs" ON retell_llms
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own LLMs" ON retell_llms
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own LLMs" ON retell_llms
  FOR DELETE USING (auth.uid() = user_id);

-- Create updated_at trigger for retell_llms
CREATE TRIGGER update_retell_llms_updated_at BEFORE UPDATE ON retell_llms
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_workspaces_user_id ON workspaces(user_id);
CREATE INDEX idx_business_profiles_workspace_id ON business_profiles(workspace_id);
CREATE INDEX idx_business_profiles_user_id ON business_profiles(user_id);
CREATE INDEX idx_voices_provider ON voices(provider);
CREATE INDEX idx_voices_is_active ON voices(is_active);
CREATE INDEX idx_retell_llms_user_id ON retell_llms(user_id);
CREATE INDEX idx_retell_llms_workspace_id ON retell_llms(workspace_id);
CREATE INDEX idx_retell_llms_industry ON retell_llms(industry);
CREATE INDEX idx_retell_llms_is_active ON retell_llms(is_active);
CREATE INDEX idx_retell_llms_is_public ON retell_llms(is_public);

-- Insert sample HVAC LLM
INSERT INTO retell_llms (
  id,
  user_id,
  workspace_id,
  name,
  description,
  industry,
  llm_config,
  is_active,
  is_public,
  usage_count
) VALUES (
  'hvac-sample-llm-001',
  (SELECT id FROM auth.users LIMIT 1), -- Replace with actual user ID
  (SELECT id FROM workspaces LIMIT 1), -- Replace with actual workspace ID
  'HVAC Service Assistant',
  'Professional HVAC technician assistant for heating, cooling, and maintenance services',
  'hvac',
  '{
    "model": "gpt-4",
    "temperature": 0.7,
    "max_tokens": 500,
    "system_prompt": "You are a professional HVAC technician assistant AI that helps customers with heating, ventilation, and air conditioning needs. Be knowledgeable about HVAC systems, maintenance schedules, and emergency repairs. Always prioritize safety and provide clear, helpful guidance.",
    "industry_context": {
      "business_type": "HVAC Services",
      "services": ["Heating Repair", "Air Conditioning", "Maintenance", "Installation", "Duct Cleaning", "Indoor Air Quality"],
      "target_audience": "Homeowners and businesses with HVAC needs",
      "tone": "professional",
      "language": "English"
    },
    "conversation_flow": {
      "greeting": "Hello! Thank you for calling [Company Name]. I''m here to help you with your heating and cooling needs. How can I assist you today?",
      "qualification_questions": [
        "What type of HVAC issue are you experiencing?",
        "Is this an emergency or can it wait?",
        "What type of system do you have?",
        "When was the last time your system was serviced?",
        "What is your preferred appointment time?"
      ],
      "closing_statements": [
        "I''ll schedule a technician to come out and take a look at your system.",
        "Is there anything else I can help you with regarding your HVAC system?",
        "We''ll get your comfort restored as quickly as possible!"
      ],
      "escalation_triggers": ["emergency", "no heat", "no cooling", "gas leak", "carbon monoxide"]
    }
  }',
  true,
  true,
  0
);

-- Insert sample Law LLM
INSERT INTO retell_llms (
  id,
  user_id,
  workspace_id,
  name,
  description,
  industry,
  llm_config,
  is_active,
  is_public,
  usage_count
) VALUES (
  'law-sample-llm-001',
  (SELECT id FROM auth.users LIMIT 1), -- Replace with actual user ID
  (SELECT id FROM workspaces LIMIT 1), -- Replace with actual workspace ID
  'Legal Consultation Assistant',
  'Professional legal assistant for client intake and consultation scheduling',
  'legal',
  '{
    "model": "gpt-4",
    "temperature": 0.6,
    "max_tokens": 400,
    "system_prompt": "You are a professional legal assistant AI that helps potential clients understand legal services and schedule consultations. Be knowledgeable about various areas of law while being clear about limitations. Always maintain confidentiality and direct complex legal questions to qualified attorneys.",
    "industry_context": {
      "business_type": "Law Firm",
      "services": ["Personal Injury", "Family Law", "Criminal Defense", "Business Law", "Estate Planning", "Real Estate"],
      "target_audience": "Individuals and businesses seeking legal representation",
      "tone": "professional",
      "language": "English"
    },
    "conversation_flow": {
      "greeting": "Hello! Thank you for calling [Law Firm Name]. I''m here to help you understand our legal services and connect you with the right attorney. How can I assist you today?",
      "qualification_questions": [
        "What type of legal matter do you need assistance with?",
        "Is this an urgent matter or can it wait?",
        "Have you consulted with an attorney before?",
        "When would be a good time for a consultation?",
        "Are you looking for representation or just advice?"
      ],
      "closing_statements": [
        "I''ll connect you with one of our attorneys for a consultation.",
        "Is there anything else I can help you with today?",
        "We''re here to help you with your legal needs."
      ],
      "escalation_triggers": ["emergency", "arrest", "lawsuit", "deadline", "court date"]
    }
  }',
  true,
  true,
  0
);

-- Create addresses table for business profiles
CREATE TABLE addresses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  business_profile_id UUID REFERENCES business_profiles(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE NOT NULL,
  address_type TEXT NOT NULL DEFAULT 'primary', -- 'primary', 'billing', 'shipping', 'branch', etc.
  line1 TEXT NOT NULL,
  line2 TEXT,
  city TEXT NOT NULL,
  state_province TEXT,
  postal_code TEXT,
  country TEXT NOT NULL,
  is_primary BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  coordinates POINT, -- For GPS coordinates (latitude, longitude)
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security for addresses table
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for addresses
CREATE POLICY "Users can view own addresses" ON addresses
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own addresses" ON addresses
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own addresses" ON addresses
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own addresses" ON addresses
  FOR DELETE USING (auth.uid() = user_id);

-- Create updated_at trigger for addresses
CREATE TRIGGER update_addresses_updated_at BEFORE UPDATE ON addresses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_addresses_business_profile_id ON addresses(business_profile_id);
CREATE INDEX idx_addresses_user_id ON addresses(user_id);
CREATE INDEX idx_addresses_workspace_id ON addresses(workspace_id);
CREATE INDEX idx_addresses_address_type ON addresses(address_type);
CREATE INDEX idx_addresses_is_primary ON addresses(is_primary);
CREATE INDEX idx_addresses_is_active ON addresses(is_active);
CREATE INDEX idx_addresses_country ON addresses(country);
CREATE INDEX idx_addresses_city ON addresses(city);

-- Add constraint to ensure only one primary address per business profile
CREATE UNIQUE INDEX idx_unique_primary_address 
ON addresses(business_profile_id) 
WHERE is_primary = true AND is_active = true;

-- Create phone_numbers table for business profiles
CREATE TABLE phone_numbers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  business_profile_id UUID REFERENCES business_profiles(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE NOT NULL,
  phone_number TEXT NOT NULL,
  phone_type TEXT NOT NULL DEFAULT 'main', -- 'main', 'support', 'sales', 'billing', 'emergency', etc.
  location TEXT,
  country_code TEXT NOT NULL DEFAULT '+1',
  area_code TEXT,
  extension TEXT,
  assigned_agent_id UUID, -- Reference to AI agent if assigned
  assigned_agent_name TEXT, -- Name of the AI agent handling this number
  status TEXT NOT NULL DEFAULT 'active', -- 'active', 'inactive', 'suspended'
  is_primary BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  monthly_cost DECIMAL(10,2) DEFAULT 0.00,
  setup_fee DECIMAL(10,2) DEFAULT 0.00,
  provider TEXT, -- Phone service provider (Twilio, etc.)
  provider_phone_id TEXT, -- External provider's phone number ID
  features JSONB DEFAULT '{}', -- Voice, SMS, MMS capabilities
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security for phone_numbers table
ALTER TABLE phone_numbers ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for phone_numbers
CREATE POLICY "Users can view own phone numbers" ON phone_numbers
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own phone numbers" ON phone_numbers
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own phone numbers" ON phone_numbers
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own phone numbers" ON phone_numbers
  FOR DELETE USING (auth.uid() = user_id);

-- Create updated_at trigger for phone_numbers
CREATE TRIGGER update_phone_numbers_updated_at BEFORE UPDATE ON phone_numbers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_phone_numbers_business_profile_id ON phone_numbers(business_profile_id);
CREATE INDEX idx_phone_numbers_user_id ON phone_numbers(user_id);
CREATE INDEX idx_phone_numbers_workspace_id ON phone_numbers(workspace_id);
CREATE INDEX idx_phone_numbers_phone_type ON phone_numbers(phone_type);
CREATE INDEX idx_phone_numbers_status ON phone_numbers(status);
CREATE INDEX idx_phone_numbers_is_primary ON phone_numbers(is_primary);
CREATE INDEX idx_phone_numbers_is_active ON phone_numbers(is_active);
CREATE INDEX idx_phone_numbers_country_code ON phone_numbers(country_code);
CREATE INDEX idx_phone_numbers_provider ON phone_numbers(provider);
CREATE INDEX idx_phone_numbers_assigned_agent_id ON phone_numbers(assigned_agent_id);

-- Add constraint to ensure only one primary phone number per business profile
CREATE UNIQUE INDEX idx_unique_primary_phone 
ON phone_numbers(business_profile_id) 
WHERE is_primary = true AND is_active = true;

-- Add constraint to ensure unique phone numbers
CREATE UNIQUE INDEX idx_unique_phone_number 
ON phone_numbers(phone_number) 
WHERE is_active = true;

-- Create website_widgets table for client widget preferences
CREATE TABLE website_widgets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  business_profile_id UUID REFERENCES business_profiles(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE NOT NULL,
  widget_name TEXT NOT NULL DEFAULT 'AI Assistant',
  widget_color TEXT NOT NULL DEFAULT '#3B82F6', -- Default blue color
  logo_url TEXT,
  bot_name TEXT NOT NULL DEFAULT 'AI Assistant',
  popup_message TEXT NOT NULL DEFAULT 'Hi! How can I help you today?',
  show_ai_popup BOOLEAN NOT NULL DEFAULT true,
  show_ai_popup_time INTEGER NOT NULL DEFAULT 5, -- seconds
  auto_open BOOLEAN NOT NULL DEFAULT false,
  widget_position TEXT NOT NULL DEFAULT 'bottom-right', -- 'bottom-right', 'bottom-left', 'top-right', 'top-left'
  widget_size TEXT NOT NULL DEFAULT 'medium', -- 'small', 'medium', 'large'
  theme TEXT NOT NULL DEFAULT 'light', -- 'light', 'dark', 'auto'
  language TEXT NOT NULL DEFAULT 'en', -- Language code
  custom_css TEXT, -- Custom CSS styles
  custom_js TEXT, -- Custom JavaScript
  dynamic_data JSONB DEFAULT '{}', -- Dynamic data for personalization
  recaptcha_key TEXT, -- Google reCAPTCHA site key
  is_active BOOLEAN NOT NULL DEFAULT true,
  is_public BOOLEAN NOT NULL DEFAULT false, -- Allow sharing with other users
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security for website_widgets table
ALTER TABLE website_widgets ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for website_widgets
CREATE POLICY "Users can view own website widgets" ON website_widgets
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view public website widgets" ON website_widgets
  FOR SELECT USING (is_public = true);

CREATE POLICY "Users can insert own website widgets" ON website_widgets
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own website widgets" ON website_widgets
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own website widgets" ON website_widgets
  FOR DELETE USING (auth.uid() = user_id);

-- Create updated_at trigger for website_widgets
CREATE TRIGGER update_website_widgets_updated_at BEFORE UPDATE ON website_widgets
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_website_widgets_business_profile_id ON website_widgets(business_profile_id);
CREATE INDEX idx_website_widgets_user_id ON website_widgets(user_id);
CREATE INDEX idx_website_widgets_workspace_id ON website_widgets(workspace_id);
CREATE INDEX idx_website_widgets_is_active ON website_widgets(is_active);
CREATE INDEX idx_website_widgets_is_public ON website_widgets(is_public);
CREATE INDEX idx_website_widgets_widget_position ON website_widgets(widget_position);
CREATE INDEX idx_website_widgets_theme ON website_widgets(theme);
CREATE INDEX idx_website_widgets_language ON website_widgets(language);

-- Add constraint to ensure only one active widget per business profile
CREATE UNIQUE INDEX idx_unique_active_widget 
ON website_widgets(business_profile_id) 
WHERE is_active = true;

-- Insert default widget configuration for existing business profiles
INSERT INTO website_widgets (
  business_profile_id,
  user_id,
  workspace_id,
  widget_name,
  widget_color,
  bot_name,
  popup_message,
  show_ai_popup,
  show_ai_popup_time,
  auto_open,
  widget_position,
  widget_size,
  theme,
  language,
  is_active,
  is_public
)
SELECT 
  bp.id,
  bp.user_id,
  bp.workspace_id,
  'AI Assistant',
  '#3B82F6',
  'AI Assistant',
  'Hi! How can I help you today?',
  true,
  5,
  false,
  'bottom-right',
  'medium',
  'light',
  'en',
  true,
  false
FROM business_profiles bp
WHERE NOT EXISTS (
  SELECT 1 FROM website_widgets ww 
  WHERE ww.business_profile_id = bp.id
);
