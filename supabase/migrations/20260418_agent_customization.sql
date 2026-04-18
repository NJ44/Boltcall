-- Agent customization: per-agent avatar (emoji) and accent color
ALTER TABLE agents
  ADD COLUMN IF NOT EXISTS avatar TEXT DEFAULT NULL,   -- emoji char, e.g. "🤖"
  ADD COLUMN IF NOT EXISTS color  TEXT DEFAULT NULL;   -- hex string, e.g. "#3B82F6"
