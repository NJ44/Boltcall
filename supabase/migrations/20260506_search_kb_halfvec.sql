-- Update search_kb function to accept a halfvec query embedding.
-- Required because knowledge_base.embedding was resized from vector(1536) to
-- halfvec(3072) in 20260506_kb_embedding_3072.sql, and pgvector distance
-- operators (<=>) require both operands to be the same type.

CREATE OR REPLACE FUNCTION public.search_kb(
  query_embedding halfvec,
  match_user_id uuid,
  match_count integer DEFAULT 3,
  match_threshold double precision DEFAULT 0.7
)
RETURNS TABLE(id uuid, title character varying, content text, category character varying, similarity double precision)
LANGUAGE plpgsql
AS $function$
BEGIN
  RETURN QUERY
  SELECT
    kb.id,
    kb.title,
    kb.content,
    kb.category,
    1 - (kb.embedding <=> query_embedding) AS similarity
  FROM knowledge_base kb
  WHERE kb.user_id = match_user_id
    AND kb.tier = 'search'
    AND kb.status = 'active'
    AND kb.embedding IS NOT NULL
    AND 1 - (kb.embedding <=> query_embedding) > match_threshold
  ORDER BY kb.embedding <=> query_embedding
  LIMIT match_count;
END;
$function$;
