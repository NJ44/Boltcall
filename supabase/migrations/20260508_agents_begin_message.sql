-- Add begin_message column to agents table.
-- Stores the opening greeting the voice agent says at the start of every call.
-- Used by retell-llm-server (custom LLM WebSocket) to send the first message to Retell.
ALTER TABLE agents ADD COLUMN IF NOT EXISTS begin_message TEXT;
