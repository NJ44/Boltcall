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

-- To enable vector search capabilities (optional):
-- Run this command in Supabase SQL editor first:
-- CREATE EXTENSION IF NOT EXISTS vector;
-- Then uncomment the embedding_vector line in knowledge_base table

-- Agents table
CREATE TABLE agents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  business_profile_id UUID NOT NULL REFERENCES business_profiles(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  workspace_id UUID,
  
  -- Agent basic information
  name VARCHAR(255) NOT NULL,
  description TEXT,
  agent_type VARCHAR(50) NOT NULL DEFAULT 'ai_receptionist', -- ai_receptionist, sms_agent, ads_agent, website_agent
  status VARCHAR(20) NOT NULL DEFAULT 'active', -- active, inactive, training, error
  
  -- Agent configuration
  voice_id VARCHAR(255), -- Retell voice ID
  voice_settings JSONB DEFAULT '{}',
  language VARCHAR(10) DEFAULT 'en',
  accent VARCHAR(50),
  speaking_speed DECIMAL(3,2) DEFAULT 1.0,
  
  -- AI configuration
  personality VARCHAR(255),
  conversation_style VARCHAR(100) DEFAULT 'professional',
  max_conversation_length INTEGER DEFAULT 50,
  response_delay INTEGER DEFAULT 1000, -- milliseconds
  
  -- Business logic
  business_hours JSONB DEFAULT '{}',
  after_hours_message TEXT,
  escalation_rules JSONB DEFAULT '{}',
  call_routing JSONB DEFAULT '{}',
  
  -- Performance metrics
  total_calls INTEGER DEFAULT 0,
  successful_calls INTEGER DEFAULT 0,
  average_call_duration INTEGER DEFAULT 0, -- seconds
  conversion_rate DECIMAL(5,2) DEFAULT 0.0,
  customer_satisfaction DECIMAL(3,2) DEFAULT 0.0,
  
  -- Integration settings
  integrations JSONB DEFAULT '{}',
  webhook_urls JSONB DEFAULT '{}',
  api_keys JSONB DEFAULT '{}',
  
  -- Metadata
  tags TEXT[],
  is_public BOOLEAN DEFAULT false,
  is_template BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Knowledge base table
CREATE TABLE knowledge_base (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  business_profile_id UUID NOT NULL REFERENCES business_profiles(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  workspace_id UUID,
  
  -- Content information
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  content_type VARCHAR(50) NOT NULL DEFAULT 'text', -- text, faq, policy, procedure, product_info
  category VARCHAR(100),
  subcategory VARCHAR(100),
  
  -- Content metadata
  keywords TEXT[],
  tags TEXT[],
  language VARCHAR(10) DEFAULT 'en',
  priority INTEGER DEFAULT 1, -- 1-5, higher number = higher priority
  
  -- Usage tracking
  usage_count INTEGER DEFAULT 0,
  last_used_at TIMESTAMP WITH TIME ZONE,
  success_rate DECIMAL(5,2) DEFAULT 0.0,
  
  -- Content status
  status VARCHAR(20) NOT NULL DEFAULT 'active', -- active, inactive, draft, archived
  is_public BOOLEAN DEFAULT false,
  is_verified BOOLEAN DEFAULT false,
  
  -- File attachments
  attachments JSONB DEFAULT '[]',
  file_urls TEXT[],
  
  -- AI processing
  -- embedding_vector VECTOR(1536), -- Uncomment after enabling vector extension
  ai_summary TEXT,
  ai_tags TEXT[],
  
  -- Version control
  version INTEGER DEFAULT 1,
  parent_id UUID REFERENCES knowledge_base(id) ON DELETE SET NULL,
  
  -- Metadata
  source VARCHAR(255),
  author VARCHAR(255),
  last_reviewed_at TIMESTAMP WITH TIME ZONE,
  review_interval_days INTEGER DEFAULT 90,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for agents table
CREATE INDEX idx_agents_business_profile_id ON agents(business_profile_id);
CREATE INDEX idx_agents_user_id ON agents(user_id);
CREATE INDEX idx_agents_workspace_id ON agents(workspace_id);
CREATE INDEX idx_agents_status ON agents(status);
CREATE INDEX idx_agents_agent_type ON agents(agent_type);
CREATE INDEX idx_agents_created_at ON agents(created_at);

-- Create indexes for knowledge_base table
CREATE INDEX idx_knowledge_base_business_profile_id ON knowledge_base(business_profile_id);
CREATE INDEX idx_knowledge_base_user_id ON knowledge_base(user_id);
CREATE INDEX idx_knowledge_base_workspace_id ON knowledge_base(workspace_id);
CREATE INDEX idx_knowledge_base_content_type ON knowledge_base(content_type);
CREATE INDEX idx_knowledge_base_category ON knowledge_base(category);
CREATE INDEX idx_knowledge_base_status ON knowledge_base(status);
CREATE INDEX idx_knowledge_base_priority ON knowledge_base(priority);
CREATE INDEX idx_knowledge_base_keywords ON knowledge_base USING GIN(keywords);
CREATE INDEX idx_knowledge_base_tags ON knowledge_base USING GIN(tags);
CREATE INDEX idx_knowledge_base_created_at ON knowledge_base(created_at);

-- Create vector index for embeddings (if using vector search)
-- CREATE INDEX idx_knowledge_base_embedding ON knowledge_base USING ivfflat (embedding_vector vector_cosine_ops) WITH (lists = 100);

-- Create RLS policies for agents table
ALTER TABLE agents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own agents" ON agents
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own agents" ON agents
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own agents" ON agents
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own agents" ON agents
  FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for knowledge_base table
ALTER TABLE knowledge_base ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own knowledge base" ON knowledge_base
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own knowledge base" ON knowledge_base
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own knowledge base" ON knowledge_base
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own knowledge base" ON knowledge_base
  FOR DELETE USING (auth.uid() = user_id);

-- Create updated_at triggers for both tables
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_agents_updated_at BEFORE UPDATE ON agents
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_knowledge_base_updated_at BEFORE UPDATE ON knowledge_base
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create clients table (your clients' clients/customers)
CREATE TABLE clients (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  business_profile_id UUID NOT NULL REFERENCES business_profiles(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  workspace_id UUID,
  
  -- Client identification
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(20),
  
  -- Additional contact info
  address_line1 VARCHAR(255),
  address_line2 VARCHAR(255),
  city VARCHAR(100),
  state VARCHAR(100),
  postal_code VARCHAR(20),
  country VARCHAR(100),
  
  -- Client preferences
  preferred_contact_method VARCHAR(20) DEFAULT 'phone', -- phone, email, sms, whatsapp
  preferred_contact_time VARCHAR(50), -- morning, afternoon, evening, anytime
  timezone VARCHAR(50),
  language VARCHAR(10) DEFAULT 'en',
  
  -- Client status and tags
  status VARCHAR(20) NOT NULL DEFAULT 'active', -- active, inactive, prospect, archived
  tags TEXT[],
  notes TEXT,
  
  -- Service history tracking
  total_services INTEGER DEFAULT 0,
  last_service_date TIMESTAMP WITH TIME ZONE,
  next_service_due TIMESTAMP WITH TIME ZONE,
  lifetime_value DECIMAL(10,2) DEFAULT 0.0,
  
  -- Client source and acquisition
  acquisition_source VARCHAR(100), -- referral, website, social_media, advertisement, etc.
  referral_source VARCHAR(255),
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create post_service_followups table
CREATE TABLE post_service_followups (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  business_profile_id UUID NOT NULL REFERENCES business_profiles(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  workspace_id UUID,
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  
  -- Service information
  service_type VARCHAR(100) NOT NULL,
  service_date TIMESTAMP WITH TIME ZONE NOT NULL,
  service_description TEXT,
  service_cost DECIMAL(10,2),
  technician_name VARCHAR(100),
  
  -- Follow-up scheduling
  followup_type VARCHAR(50) NOT NULL DEFAULT 'satisfaction', -- satisfaction, maintenance, upsell, feedback, reminder
  scheduled_date TIMESTAMP WITH TIME ZONE NOT NULL,
  due_date TIMESTAMP WITH TIME ZONE,
  priority VARCHAR(20) DEFAULT 'medium', -- low, medium, high, urgent
  
  -- Follow-up method and content
  contact_method VARCHAR(20) DEFAULT 'phone', -- phone, email, sms, whatsapp, in_person
  followup_template VARCHAR(100), -- reference to template used
  custom_message TEXT,
  
  -- Follow-up execution
  status VARCHAR(20) NOT NULL DEFAULT 'scheduled', -- scheduled, in_progress, completed, cancelled, failed
  attempted_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  attempts_count INTEGER DEFAULT 0,
  max_attempts INTEGER DEFAULT 3,
  
  -- Results and outcomes
  contact_successful BOOLEAN,
  client_response VARCHAR(20), -- satisfied, dissatisfied, no_answer, callback_requested, not_interested
  satisfaction_rating INTEGER CHECK (satisfaction_rating >= 1 AND satisfaction_rating <= 5),
  feedback TEXT,
  
  -- Next actions
  next_action VARCHAR(100), -- schedule_maintenance, send_quote, follow_up_again, close_case, escalate
  next_action_date TIMESTAMP WITH TIME ZONE,
  assigned_to VARCHAR(100), -- staff member assigned to handle
  
  -- Automation and AI
  automated BOOLEAN DEFAULT false,
  ai_generated_message BOOLEAN DEFAULT false,
  ai_sentiment_score DECIMAL(3,2), -- -1.0 to 1.0
  ai_summary TEXT,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id)
);

-- Enable Row Level Security
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_service_followups ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for clients table
CREATE POLICY "Users can view own clients" ON clients
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own clients" ON clients
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own clients" ON clients
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own clients" ON clients
  FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for post_service_followups table
CREATE POLICY "Users can view own followups" ON post_service_followups
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own followups" ON post_service_followups
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own followups" ON post_service_followups
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own followups" ON post_service_followups
  FOR DELETE USING (auth.uid() = user_id);

-- Create updated_at triggers
CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON clients
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_post_service_followups_updated_at BEFORE UPDATE ON post_service_followups
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for clients table
CREATE INDEX idx_clients_business_profile_id ON clients(business_profile_id);
CREATE INDEX idx_clients_user_id ON clients(user_id);
CREATE INDEX idx_clients_workspace_id ON clients(workspace_id);
CREATE INDEX idx_clients_email ON clients(email);
CREATE INDEX idx_clients_phone ON clients(phone);
CREATE INDEX idx_clients_status ON clients(status);
CREATE INDEX idx_clients_last_service_date ON clients(last_service_date);
CREATE INDEX idx_clients_next_service_due ON clients(next_service_due);
CREATE INDEX idx_clients_created_at ON clients(created_at);
CREATE INDEX idx_clients_name ON clients(first_name, last_name);
CREATE INDEX idx_clients_tags ON clients USING GIN(tags);

-- Create indexes for post_service_followups table
CREATE INDEX idx_followups_business_profile_id ON post_service_followups(business_profile_id);
CREATE INDEX idx_followups_user_id ON post_service_followups(user_id);
CREATE INDEX idx_followups_workspace_id ON post_service_followups(workspace_id);
CREATE INDEX idx_followups_client_id ON post_service_followups(client_id);
CREATE INDEX idx_followups_service_date ON post_service_followups(service_date);
CREATE INDEX idx_followups_scheduled_date ON post_service_followups(scheduled_date);
CREATE INDEX idx_followups_due_date ON post_service_followups(due_date);
CREATE INDEX idx_followups_status ON post_service_followups(status);
CREATE INDEX idx_followups_followup_type ON post_service_followups(followup_type);
CREATE INDEX idx_followups_priority ON post_service_followups(priority);
CREATE INDEX idx_followups_contact_method ON post_service_followups(contact_method);
CREATE INDEX idx_followups_created_at ON post_service_followups(created_at);
CREATE INDEX idx_followups_completed_at ON post_service_followups(completed_at);

-- Create calcom_api_keys table for managing clients' Cal.com integrations
CREATE TABLE calcom_api_keys (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  business_profile_id UUID NOT NULL REFERENCES business_profiles(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  workspace_id UUID,
  
  -- Cal.com API key information
  api_key_name VARCHAR(255) NOT NULL, -- Friendly name for the API key
  api_key_hash VARCHAR(255) NOT NULL, -- Encrypted/hashed API key for security
  cal_user_id VARCHAR(100), -- Cal.com user ID associated with this key
  cal_username VARCHAR(100), -- Cal.com username
  cal_email VARCHAR(255), -- Email associated with Cal.com account
  
  -- API key metadata
  key_type VARCHAR(50) DEFAULT 'personal', -- personal, team, organization
  permissions JSONB DEFAULT '{}', -- Permissions granted to this API key
  scopes TEXT[] DEFAULT '{}', -- API scopes (read, write, admin, etc.)
  
  -- Connection status
  status VARCHAR(20) NOT NULL DEFAULT 'active', -- active, inactive, expired, revoked
  is_verified BOOLEAN DEFAULT false, -- Whether the API key has been verified
  last_verified_at TIMESTAMP WITH TIME ZONE,
  verification_error TEXT, -- Last verification error if any
  
  -- Usage tracking
  last_used_at TIMESTAMP WITH TIME ZONE,
  total_requests INTEGER DEFAULT 0,
  monthly_requests INTEGER DEFAULT 0,
  last_request_reset TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Rate limiting
  rate_limit_per_hour INTEGER DEFAULT 1000,
  rate_limit_per_day INTEGER DEFAULT 10000,
  current_hour_requests INTEGER DEFAULT 0,
  current_day_requests INTEGER DEFAULT 0,
  
  -- Cal.com account details
  cal_account_info JSONB DEFAULT '{}', -- Store account details from Cal.com API
  available_event_types JSONB DEFAULT '[]', -- Cache of available event types
  connected_calendars JSONB DEFAULT '[]', -- Connected calendar providers
  
  -- Integration settings
  auto_sync_enabled BOOLEAN DEFAULT true,
  sync_frequency_minutes INTEGER DEFAULT 15, -- How often to sync data
  last_sync_at TIMESTAMP WITH TIME ZONE,
  sync_status VARCHAR(20) DEFAULT 'pending', -- pending, syncing, completed, failed
  sync_error TEXT,
  
  -- Webhook configuration
  webhook_url VARCHAR(500), -- Webhook URL for Cal.com events
  webhook_secret VARCHAR(255), -- Secret for webhook verification
  webhook_events TEXT[] DEFAULT '{}', -- Events to listen for
  webhook_active BOOLEAN DEFAULT false,
  
  -- Security and expiration
  expires_at TIMESTAMP WITH TIME ZONE, -- When the API key expires
  created_by_ip VARCHAR(45), -- IP address when key was created
  last_used_ip VARCHAR(45), -- Last IP address that used this key
  
  -- Metadata
  notes TEXT, -- Admin notes about this API key
  tags TEXT[], -- Tags for organization
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id)
);

-- Create calcom_event_types table to store event types from Cal.com
CREATE TABLE calcom_event_types (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  calcom_api_key_id UUID NOT NULL REFERENCES calcom_api_keys(id) ON DELETE CASCADE,
  business_profile_id UUID NOT NULL REFERENCES business_profiles(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Cal.com event type details
  calcom_event_type_id VARCHAR(100) NOT NULL, -- ID from Cal.com
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL,
  description TEXT,
  length INTEGER NOT NULL, -- Duration in minutes
  
  -- Event type configuration
  price DECIMAL(10,2) DEFAULT 0.0,
  currency VARCHAR(3) DEFAULT 'USD',
  locations JSONB DEFAULT '[]', -- Meeting locations (zoom, phone, in-person, etc.)
  
  -- Availability settings
  availability JSONB DEFAULT '{}', -- Availability rules
  booking_limits JSONB DEFAULT '{}', -- Booking limits and restrictions
  buffer_time_before INTEGER DEFAULT 0, -- Buffer time before event (minutes)
  buffer_time_after INTEGER DEFAULT 0, -- Buffer time after event (minutes)
  
  -- Booking settings
  requires_confirmation BOOLEAN DEFAULT false,
  disable_guests BOOLEAN DEFAULT false,
  hide_calendar_notes BOOLEAN DEFAULT false,
  minimum_booking_notice INTEGER DEFAULT 120, -- Minimum notice in minutes
  
  -- Integration settings
  is_enabled BOOLEAN DEFAULT true, -- Whether this event type is enabled for booking
  is_synced BOOLEAN DEFAULT true, -- Whether to sync this event type
  custom_fields JSONB DEFAULT '[]', -- Custom fields for this event type
  
  -- Metadata from Cal.com
  calcom_metadata JSONB DEFAULT '{}', -- Raw metadata from Cal.com API
  last_synced_at TIMESTAMP WITH TIME ZONE,
  
  -- Local metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create calcom_bookings table to store booking information
CREATE TABLE calcom_bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  calcom_api_key_id UUID NOT NULL REFERENCES calcom_api_keys(id) ON DELETE CASCADE,
  calcom_event_type_id UUID REFERENCES calcom_event_types(id) ON DELETE SET NULL,
  business_profile_id UUID NOT NULL REFERENCES business_profiles(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
  
  -- Cal.com booking details
  calcom_booking_id VARCHAR(100) NOT NULL UNIQUE, -- ID from Cal.com
  calcom_booking_uid VARCHAR(255), -- UID from Cal.com
  title VARCHAR(255) NOT NULL,
  description TEXT,
  
  -- Booking time details
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  timezone VARCHAR(100) NOT NULL,
  
  -- Attendee information
  attendees JSONB DEFAULT '[]', -- List of attendees with details
  organizer JSONB DEFAULT '{}', -- Organizer details
  
  -- Booking status
  status VARCHAR(50) NOT NULL DEFAULT 'confirmed', -- confirmed, cancelled, rescheduled, no_show
  cancellation_reason TEXT,
  rescheduled_from_id VARCHAR(100), -- If rescheduled, original booking ID
  rescheduled_to_id VARCHAR(100), -- If rescheduled, new booking ID
  
  -- Meeting details
  location JSONB DEFAULT '{}', -- Meeting location details
  meeting_url VARCHAR(500), -- Video meeting URL if applicable
  meeting_password VARCHAR(100), -- Meeting password if applicable
  
  -- Payment information (if applicable)
  payment_status VARCHAR(50), -- pending, paid, failed, refunded
  payment_amount DECIMAL(10,2),
  payment_currency VARCHAR(3),
  payment_id VARCHAR(255), -- External payment ID
  
  -- Metadata
  calcom_metadata JSONB DEFAULT '{}', -- Raw metadata from Cal.com
  custom_responses JSONB DEFAULT '{}', -- Custom field responses
  
  -- Sync information
  last_synced_at TIMESTAMP WITH TIME ZONE,
  sync_status VARCHAR(20) DEFAULT 'synced', -- synced, pending, failed
  
  -- Local metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE calcom_api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE calcom_event_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE calcom_bookings ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for calcom_api_keys table
CREATE POLICY "Users can view own Cal.com API keys" ON calcom_api_keys
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own Cal.com API keys" ON calcom_api_keys
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own Cal.com API keys" ON calcom_api_keys
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own Cal.com API keys" ON calcom_api_keys
  FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for calcom_event_types table
CREATE POLICY "Users can view own Cal.com event types" ON calcom_event_types
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own Cal.com event types" ON calcom_event_types
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own Cal.com event types" ON calcom_event_types
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own Cal.com event types" ON calcom_event_types
  FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for calcom_bookings table
CREATE POLICY "Users can view own Cal.com bookings" ON calcom_bookings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own Cal.com bookings" ON calcom_bookings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own Cal.com bookings" ON calcom_bookings
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own Cal.com bookings" ON calcom_bookings
  FOR DELETE USING (auth.uid() = user_id);

-- Create updated_at triggers
CREATE TRIGGER update_calcom_api_keys_updated_at BEFORE UPDATE ON calcom_api_keys
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_calcom_event_types_updated_at BEFORE UPDATE ON calcom_event_types
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_calcom_bookings_updated_at BEFORE UPDATE ON calcom_bookings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for calcom_api_keys table
CREATE INDEX idx_calcom_api_keys_business_profile_id ON calcom_api_keys(business_profile_id);
CREATE INDEX idx_calcom_api_keys_user_id ON calcom_api_keys(user_id);
CREATE INDEX idx_calcom_api_keys_workspace_id ON calcom_api_keys(workspace_id);
CREATE INDEX idx_calcom_api_keys_status ON calcom_api_keys(status);
CREATE INDEX idx_calcom_api_keys_cal_user_id ON calcom_api_keys(cal_user_id);
CREATE INDEX idx_calcom_api_keys_cal_email ON calcom_api_keys(cal_email);
CREATE INDEX idx_calcom_api_keys_last_used_at ON calcom_api_keys(last_used_at);
CREATE INDEX idx_calcom_api_keys_expires_at ON calcom_api_keys(expires_at);
CREATE INDEX idx_calcom_api_keys_created_at ON calcom_api_keys(created_at);

-- Create indexes for calcom_event_types table
CREATE INDEX idx_calcom_event_types_api_key_id ON calcom_event_types(calcom_api_key_id);
CREATE INDEX idx_calcom_event_types_business_profile_id ON calcom_event_types(business_profile_id);
CREATE INDEX idx_calcom_event_types_user_id ON calcom_event_types(user_id);
CREATE INDEX idx_calcom_event_types_calcom_id ON calcom_event_types(calcom_event_type_id);
CREATE INDEX idx_calcom_event_types_slug ON calcom_event_types(slug);
CREATE INDEX idx_calcom_event_types_is_enabled ON calcom_event_types(is_enabled);
CREATE INDEX idx_calcom_event_types_last_synced_at ON calcom_event_types(last_synced_at);

-- Create indexes for calcom_bookings table
CREATE INDEX idx_calcom_bookings_api_key_id ON calcom_bookings(calcom_api_key_id);
CREATE INDEX idx_calcom_bookings_event_type_id ON calcom_bookings(calcom_event_type_id);
CREATE INDEX idx_calcom_bookings_business_profile_id ON calcom_bookings(business_profile_id);
CREATE INDEX idx_calcom_bookings_user_id ON calcom_bookings(user_id);
CREATE INDEX idx_calcom_bookings_client_id ON calcom_bookings(client_id);
CREATE INDEX idx_calcom_bookings_calcom_id ON calcom_bookings(calcom_booking_id);
CREATE INDEX idx_calcom_bookings_start_time ON calcom_bookings(start_time);
CREATE INDEX idx_calcom_bookings_end_time ON calcom_bookings(end_time);
CREATE INDEX idx_calcom_bookings_status ON calcom_bookings(status);
CREATE INDEX idx_calcom_bookings_payment_status ON calcom_bookings(payment_status);
CREATE INDEX idx_calcom_bookings_last_synced_at ON calcom_bookings(last_synced_at);

-- =====================================================
-- NOTIFICATION PREFERENCES TABLES
-- =====================================================

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

-- Function to initialize default notification preferences for new users
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
