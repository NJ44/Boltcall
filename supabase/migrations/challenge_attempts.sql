-- Break My AI Challenge — Attempt tracking & leaderboard
-- Run this in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS challenge_attempts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  code_submitted TEXT NOT NULL,
  is_correct BOOLEAN NOT NULL DEFAULT false,
  week TEXT NOT NULL,              -- e.g. "2026-W14"
  call_duration_seconds INTEGER,   -- how long the call lasted
  technique_used TEXT,             -- what social engineering technique they tried
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes for fast leaderboard queries
CREATE INDEX IF NOT EXISTS idx_challenge_week ON challenge_attempts(week);
CREATE INDEX IF NOT EXISTS idx_challenge_correct ON challenge_attempts(is_correct);
CREATE INDEX IF NOT EXISTS idx_challenge_created ON challenge_attempts(created_at DESC);

-- Enable RLS (public inserts via Netlify function, no direct client access)
ALTER TABLE challenge_attempts ENABLE ROW LEVEL SECURITY;

-- Allow the service role full access (Netlify functions use service key)
CREATE POLICY "Service role full access" ON challenge_attempts
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Allow anonymous reads for the leaderboard (anon key from frontend)
CREATE POLICY "Public can read challenge attempts" ON challenge_attempts
  FOR SELECT
  USING (true);
