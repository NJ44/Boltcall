CREATE TABLE demo_sessions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  business_name text NOT NULL,
  niche text,
  services text,
  location text,
  website_url text,
  prospect_name text,
  created_at timestamptz DEFAULT now(),
  clicked_at timestamptz
);

ALTER TABLE demo_sessions ENABLE ROW LEVEL SECURITY;

-- Anon insert: daily-facebook skill creates rows via MCP (anon key)
CREATE POLICY "public_insert" ON demo_sessions
  FOR INSERT WITH CHECK (true);

-- Anon select: landing page fetches context by id without auth
CREATE POLICY "public_select" ON demo_sessions
  FOR SELECT USING (true);
