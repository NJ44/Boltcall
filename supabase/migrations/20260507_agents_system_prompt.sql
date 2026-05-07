-- Add canonical system_prompt column to agents table.
-- This becomes the single source of truth for the agent's master prompt.
-- ai-assistant.ts already writes to system_prompt (lines 352, 397) but the
-- column didn't exist before this migration, so those updates were silently
-- failing. After this migration:
--   - All Retell prompt writes also mirror to agents.system_prompt
--   - SMS/email/WhatsApp responders read from agents.system_prompt
--   - Single source of truth across channels (voice + text)

ALTER TABLE agents
  ADD COLUMN IF NOT EXISTS system_prompt TEXT,
  ADD COLUMN IF NOT EXISTS system_prompt_synced_at TIMESTAMPTZ;

COMMENT ON COLUMN agents.system_prompt IS
  'Canonical agent system prompt. Mirrored to Retell LLM general_prompt on update. Read by SMS/email/WhatsApp responders for cross-channel consistency.';

COMMENT ON COLUMN agents.system_prompt_synced_at IS
  'Last time system_prompt was synced from/to Retell. NULL = never synced.';
