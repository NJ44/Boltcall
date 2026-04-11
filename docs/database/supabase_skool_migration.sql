-- Skool Community Outreach Pipeline - Supabase Migration
-- Run this in Supabase SQL Editor

-- 1. Skool Groups: discovered communities
CREATE TABLE IF NOT EXISTS skool_groups (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  url text UNIQUE NOT NULL,
  platform text DEFAULT 'skool' CHECK (platform IN ('skool', 'facebook')),
  niche text NOT NULL,
  member_count integer,
  description text,
  price text DEFAULT 'free',
  icp_score integer CHECK (icp_score BETWEEN 0 AND 5),
  tier text CHECK (tier IN ('A', 'B', 'C')),
  status text DEFAULT 'prospect' CHECK (status IN ('prospect', 'pending_join', 'joined', 'active', 'paused', 'left', 'rejected')),
  posting_rules text,
  join_date date,
  last_scraped_at timestamptz DEFAULT now(),
  discovered_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_skool_groups_niche ON skool_groups(niche);
CREATE INDEX IF NOT EXISTS idx_skool_groups_status ON skool_groups(status);
CREATE INDEX IF NOT EXISTS idx_skool_groups_tier ON skool_groups(tier);

-- 2. Skool Posts: drafted and posted content
CREATE TABLE IF NOT EXISTS skool_posts (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  group_id uuid REFERENCES skool_groups(id) ON DELETE CASCADE,
  niche text NOT NULL,
  framework text NOT NULL,
  topic text,
  body text NOT NULL,
  word_count integer,
  lead_magnet_url text,
  status text DEFAULT 'draft' CHECK (status IN ('draft', 'approved', 'posted', 'archived')),
  posted_at timestamptz,
  likes integer DEFAULT 0,
  comments integer DEFAULT 0,
  dms_received integer DEFAULT 0,
  leads_generated integer DEFAULT 0,
  engagement_last_checked timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_skool_posts_group ON skool_posts(group_id);
CREATE INDEX IF NOT EXISTS idx_skool_posts_status ON skool_posts(status);

-- 3. Niche Lead Magnets: config for dynamic landing pages
CREATE TABLE IF NOT EXISTS niche_lead_magnets (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  niche text UNIQUE NOT NULL,
  display_name text NOT NULL,
  slug text UNIQUE NOT NULL,
  tool_type text NOT NULL,
  headline text NOT NULL,
  subheadline text,
  meta_description text,
  niche_specific_fields jsonb,
  webhook_url text,
  is_deployed boolean DEFAULT true,
  deployed_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 4. Skool Outreach Metrics: daily aggregates
CREATE TABLE IF NOT EXISTS skool_outreach_metrics (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  date date NOT NULL DEFAULT CURRENT_DATE,
  groups_discovered integer DEFAULT 0,
  groups_joined integer DEFAULT 0,
  posts_drafted integer DEFAULT 0,
  posts_published integer DEFAULT 0,
  total_likes integer DEFAULT 0,
  total_comments integer DEFAULT 0,
  dms_sent integer DEFAULT 0,
  dms_replied integer DEFAULT 0,
  leads_generated integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  UNIQUE(date)
);

-- 5. Enable RLS but allow anon read on niche_lead_magnets (public pages need to read config)
ALTER TABLE niche_lead_magnets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read on niche_lead_magnets" ON niche_lead_magnets
  FOR SELECT USING (true);

-- 6. Seed initial niche lead magnets
INSERT INTO niche_lead_magnets (niche, display_name, slug, tool_type, headline, subheadline, meta_description, niche_specific_fields) VALUES
('dentists', 'Dentist AI Revenue Calculator', 'dentist-ai-calculator', 'ai-revenue-calculator',
 'See How Much Revenue AI Can Add to Your Dental Practice',
 'Free calculator shows how AI phone answering, appointment reminders, and review automation can increase your practice revenue.',
 'Free AI revenue calculator for dental practices. See how much revenue you''re leaving on the table from missed calls and no-shows.',
 '{"social_proof_text": "Used by 200+ dental practices", "cta_text": "Calculate My Revenue", "result_metrics": ["Missed call revenue recovery", "No-show reduction savings", "Review automation ROI", "AI receptionist cost savings"]}'::jsonb),

('med-spas', 'Med Spa AI Revenue Calculator', 'medspa-ai-calculator', 'ai-revenue-calculator',
 'See How Much Revenue AI Can Add to Your Med Spa',
 'Free calculator shows how AI booking, follow-ups, and review automation can boost your med spa revenue.',
 'Free AI revenue calculator for med spas. Discover revenue lost to missed calls, late cancellations, and manual follow-ups.',
 '{"social_proof_text": "Trusted by leading med spas", "cta_text": "Calculate My Revenue", "result_metrics": ["Missed booking recovery", "Late cancellation savings", "Automated follow-up ROI", "Google review growth potential"]}'::jsonb),

('barbershops', 'Barbershop AI Revenue Calculator', 'barbershop-ai-calculator', 'ai-revenue-calculator',
 'See How Much More Your Barbershop Could Earn with AI',
 'Free tool shows how AI phone answering and automated booking can fill more chairs and boost your revenue.',
 'Free AI revenue calculator for barbershops. See how much you''re losing from missed calls and empty chairs.',
 '{"social_proof_text": "Built for modern barbershops", "cta_text": "Calculate My Revenue", "result_metrics": ["Missed call recovery", "Chair utilization improvement", "Automated rebooking value", "Review generation ROI"]}'::jsonb),

('hvac', 'HVAC AI Revenue Calculator', 'hvac-ai-calculator', 'ai-revenue-calculator',
 'See How Much Revenue AI Can Recover for Your HVAC Business',
 'Free calculator shows how AI call answering and speed-to-lead can capture more HVAC jobs.',
 'Free AI revenue calculator for HVAC companies. See how much revenue you lose from missed service calls and slow follow-ups.',
 '{"social_proof_text": "Used by top HVAC contractors", "cta_text": "Calculate My Revenue", "result_metrics": ["Missed service call recovery", "Speed-to-lead improvement", "After-hours job capture", "Seasonal demand handling"]}'::jsonb),

('plumbing', 'Plumber AI Revenue Calculator', 'plumber-ai-calculator', 'ai-revenue-calculator',
 'See How Much Revenue AI Can Add to Your Plumbing Business',
 'Free calculator shows how AI phone answering captures more emergency calls and service jobs.',
 'Free AI revenue calculator for plumbing companies. See how much revenue you lose from missed emergency calls.',
 '{"social_proof_text": "Built for service businesses", "cta_text": "Calculate My Revenue", "result_metrics": ["Emergency call capture rate", "After-hours revenue recovery", "Appointment booking automation", "Customer follow-up ROI"]}'::jsonb),

('real-estate', 'Realtor AI Revenue Calculator', 'realtor-ai-calculator', 'ai-revenue-calculator',
 'See How Much Commission AI Can Help You Capture',
 'Free calculator shows how AI lead response and follow-up can help you close more deals.',
 'Free AI revenue calculator for real estate agents. See how fast lead response and automated follow-up can increase your closings.',
 '{"social_proof_text": "Used by top-producing agents", "cta_text": "Calculate My Revenue", "result_metrics": ["Lead response time improvement", "Lead-to-showing conversion lift", "Automated nurture ROI", "After-hours lead capture"]}'::jsonb),

('auto-repair', 'Auto Repair AI Revenue Calculator', 'auto-repair-ai-calculator', 'ai-revenue-calculator',
 'See How Much Revenue AI Can Add to Your Auto Shop',
 'Free calculator shows how AI call handling and appointment reminders can fill more bays.',
 'Free AI revenue calculator for auto repair shops. See how much revenue you lose from missed calls and no-shows.',
 '{"social_proof_text": "Built for auto service businesses", "cta_text": "Calculate My Revenue", "result_metrics": ["Missed call revenue recovery", "Bay utilization improvement", "No-show reduction savings", "Review automation ROI"]}'::jsonb),

('chiropractors', 'Chiropractor AI Revenue Calculator', 'chiropractor-ai-calculator', 'ai-revenue-calculator',
 'See How Much Revenue AI Can Add to Your Chiropractic Practice',
 'Free calculator shows how AI phone answering and patient reminders can grow your practice.',
 'Free AI revenue calculator for chiropractors. See how much revenue you lose from missed calls and patient no-shows.',
 '{"social_proof_text": "Trusted by chiropractic practices", "cta_text": "Calculate My Revenue", "result_metrics": ["Missed call recovery", "Patient no-show reduction", "Reactivation campaign ROI", "Google review growth"]}'::jsonb)

ON CONFLICT (niche) DO NOTHING;
