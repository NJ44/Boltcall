-- Cloned voices: user-uploaded voice clones via ElevenLabs Instant Voice Cloning,
-- registered with Retell as custom voices so they can be assigned to agents.

CREATE TABLE IF NOT EXISTS cloned_voices (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(120) NOT NULL,
  description TEXT,
  gender VARCHAR(20),                       -- 'male' | 'female' | 'neutral' | null
  accent VARCHAR(60),
  eleven_voice_id TEXT NOT NULL,            -- ElevenLabs voice_id from /v1/voices/add
  retell_voice_id TEXT NOT NULL,            -- Retell custom voice_id assigned to agents
  preview_audio_url TEXT,                   -- Optional uploaded sample for preview playback
  status VARCHAR(20) NOT NULL DEFAULT 'ready', -- 'ready' | 'processing' | 'failed'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_cloned_voices_user_id ON cloned_voices(user_id);
CREATE UNIQUE INDEX IF NOT EXISTS uq_cloned_voices_retell_voice_id ON cloned_voices(retell_voice_id);

ALTER TABLE cloned_voices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own cloned voices" ON cloned_voices
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own cloned voices" ON cloned_voices
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own cloned voices" ON cloned_voices
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own cloned voices" ON cloned_voices
  FOR DELETE USING (auth.uid() = user_id);

CREATE TRIGGER update_cloned_voices_updated_at BEFORE UPDATE ON cloned_voices
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
