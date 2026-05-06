-- Migration: Resize knowledge_base.embedding from vector(1536) to vector(3072)
--
-- Why: Switching from OpenAI text-embedding-3-small (1536-dim) to Azure
-- text-embedding-3-large (3072-dim). New embeddings won't fit the old column type.
--
-- Index change: pgvector ivfflat is capped at 2000 dimensions, so it cannot
-- index 3072-dim vectors. Drop the old ivfflat index and create a new HNSW
-- index, which supports up to 16000 dimensions.
--
-- Data impact: minimal. As of 2026-05-06 there is 1 row in knowledge_base with
-- 0 populated embeddings. After this migration runs, kb-search will re-embed
-- the row using generateEmbedding() from _shared/azure-ai.ts.
--
-- Reversibility: dropping and re-adding a vector index is fast. To roll back,
-- ALTER COLUMN back to vector(1536) (only works if existing rows have 1536-dim
-- vectors or NULL); recreate ivfflat index.

-- 1. Drop the old ivfflat index — required because ivfflat is dimension-capped.
DROP INDEX IF EXISTS idx_kb_embedding;

-- 2. Resize the column. Existing NULL embeddings stay NULL. Any existing
--    1536-dim vectors will be lost (none exist as of migration date).
ALTER TABLE knowledge_base
  ALTER COLUMN embedding TYPE vector(3072) USING NULL;

-- 3. Create HNSW index for cosine distance search at 3072 dims.
CREATE INDEX idx_kb_embedding ON knowledge_base
  USING hnsw (embedding vector_cosine_ops);
