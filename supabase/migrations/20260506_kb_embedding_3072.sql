-- Migration: Resize knowledge_base.embedding from vector(1536) to halfvec(3072).
--
-- Why: Switching from OpenAI text-embedding-3-small (1536-dim) to Azure
-- text-embedding-3-large (3072-dim). New embeddings won't fit the old column.
--
-- Type choice — halfvec instead of vector:
-- pgvector caps HNSW indexes on `vector` type at 2000 dimensions. `halfvec`
-- (16-bit float, pgvector 0.7+) supports HNSW up to 4000 dims and uses ~half
-- the storage with negligible quality loss for cosine search. 3072 fits.
--
-- Data impact: minimal. As of 2026-05-06 there is 1 row in knowledge_base with
-- 0 populated embeddings; the row's tier='prompt' so it is never embedded by
-- kb-search.ts (only tier='search' rows get embeddings). No re-embed required.
-- The accompanying migration 20260506_search_kb_halfvec.sql updates the
-- search_kb function to accept a halfvec query embedding so distance ops match.

-- 1. Drop the old ivfflat index — required before changing column type.
DROP INDEX IF EXISTS idx_kb_embedding;

-- 2. Resize the column. Existing NULL embeddings stay NULL.
ALTER TABLE knowledge_base
  ALTER COLUMN embedding TYPE halfvec(3072) USING NULL;

-- 3. Create HNSW index for cosine distance search on halfvec.
CREATE INDEX idx_kb_embedding ON knowledge_base
  USING hnsw (embedding halfvec_cosine_ops);
