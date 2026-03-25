import { Handler } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';
import { notifyError } from './_shared/notify';

/**
 * Knowledge Base Search Function
 *
 * Two-tier KB system:
 *   Tier 1 (prompt): Core business info injected directly into agent prompt
 *   Tier 2 (search): Detailed/technical info searched via vector similarity
 *
 * Actions:
 *   - search: Vector similarity search for a user's KB
 *   - add: Add a KB entry with auto-embedding
 *   - add_batch: Add multiple entries at once
 *   - get_prompt_kb: Get all Tier 1 entries formatted for prompt injection
 *   - list: List all KB entries for a user
 *   - delete: Delete a KB entry
 *   - update: Update a KB entry (re-embeds)
 */

const OPENAI_KEY = process.env.OPENAI_API_KEY || '';
const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json; charset=utf-8',
};

function getSupabase() {
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_KEY;
  if (!url || !key) throw new Error('Missing Supabase credentials');
  return createClient(url, key);
}

// Generate embedding — tries OpenAI, falls back to Supabase Edge Function
async function getEmbedding(text: string): Promise<number[] | null> {
  // Try OpenAI first
  if (OPENAI_KEY) {
    try {
      const res = await fetch('https://api.openai.com/v1/embeddings', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENAI_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ model: 'text-embedding-3-small', input: text }),
      });
      if (res.ok) {
        const data = await res.json();
        const emb = data.data?.[0]?.embedding;
        if (emb) return emb;
      }
    } catch { /* fall through */ }
  }

  // Fallback: Supabase Edge Function for embeddings (if configured)
  if (SUPABASE_URL) {
    try {
      const serviceKey = process.env.SUPABASE_SERVICE_KEY || '';
      const res = await fetch(`${SUPABASE_URL}/functions/v1/embed`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${serviceKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ input: text }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.embedding) return data.embedding;
      }
    } catch { /* fall through */ }
  }

  return null;
}

export const handler: Handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  try {
    const body = JSON.parse(event.body || '{}');
    const { action } = body;
    const supabase = getSupabase();

    // ─── SEARCH: Vector similarity search ───────────────────────────
    if (action === 'search') {
      const { userId, query, limit: matchCount } = body;
      if (!userId || !query) {
        return { statusCode: 400, headers, body: JSON.stringify({ error: 'userId and query required' }) };
      }

      // Try vector search first if embeddings are available
      const embedding = await getEmbedding(query);
      if (embedding) {
        const { data, error } = await supabase.rpc('search_kb', {
          query_embedding: JSON.stringify(embedding),
          match_user_id: userId,
          match_count: matchCount || 3,
          match_threshold: 0.65,
        });

        if (!error && data && data.length > 0) {
          return { statusCode: 200, headers, body: JSON.stringify({ success: true, results: data, method: 'vector_search' }) };
        }
      }

      // Fallback: smart text search — split query into keywords, search ALL tiers
      const keywords = query.toLowerCase().split(/\s+/).filter((w: string) => w.length > 2);
      const orConditions = keywords.map((kw: string) => `title.ilike.%${kw}%,content.ilike.%${kw}%`).join(',');

      const { data, error } = await supabase
        .from('knowledge_base')
        .select('id, title, content, category')
        .eq('user_id', userId)
        .eq('status', 'active')
        .or(orConditions)
        .limit(matchCount || 3);

      if (error) throw error;
      return { statusCode: 200, headers, body: JSON.stringify({ success: true, results: data || [], method: 'text_search' }) };
    }

    // ─── Helper: Get business_profile_id for a user ──────────────────
    async function getProfileId(userId: string): Promise<string | null> {
      const { data } = await supabase
        .from('business_profiles')
        .select('id')
        .eq('user_id', userId)
        .limit(1)
        .maybeSingle();
      return data?.id || null;
    }

    // ─── ADD: Add a single KB entry ─────────────────────────────────
    if (action === 'add') {
      const { userId, title, content, category, tier, tags } = body;
      if (!userId || !title || !content) {
        return { statusCode: 400, headers, body: JSON.stringify({ error: 'userId, title, and content required' }) };
      }

      const profileId = await getProfileId(userId);

      // Generate embedding for search-tier entries
      let embedding = null;
      if ((tier || 'search') === 'search') {
        embedding = await getEmbedding(`${title}\n${content}`);
      }

      const { data, error } = await supabase
        .from('knowledge_base')
        .insert({
          user_id: userId,
          business_profile_id: profileId,
          title,
          content,
          category: category || 'general',
          tier: tier || 'search',
          tags: tags || [],
          status: 'active',
          embedding: embedding ? JSON.stringify(embedding) : null,
        })
        .select('id, title, category, tier')
        .single();

      if (error) throw error;
      return { statusCode: 200, headers, body: JSON.stringify({ success: true, entry: data, embedded: !!embedding }) };
    }

    // ─── ADD_BATCH: Add multiple entries at once ────────────────────
    if (action === 'add_batch') {
      const { userId, entries } = body;
      if (!userId || !entries?.length) {
        return { statusCode: 400, headers, body: JSON.stringify({ error: 'userId and entries array required' }) };
      }

      const profileId = await getProfileId(userId);
      const results = [];
      for (const entry of entries) {
        let embedding = null;
        if ((entry.tier || 'search') === 'search') {
          embedding = await getEmbedding(`${entry.title}\n${entry.content}`);
        }

        const { data, error } = await supabase
          .from('knowledge_base')
          .insert({
            user_id: userId,
            business_profile_id: profileId,
            title: entry.title,
            content: entry.content,
            category: entry.category || 'general',
            tier: entry.tier || 'search',
            tags: entry.tags || [],
            status: 'active',
            embedding: embedding ? JSON.stringify(embedding) : null,
          })
          .select('id, title, tier')
          .single();

        results.push({ title: entry.title, success: !error, id: data?.id, error: error?.message });
      }

      return { statusCode: 200, headers, body: JSON.stringify({ success: true, added: results.filter(r => r.success).length, total: entries.length, results }) };
    }

    // ─── GET_PROMPT_KB: Get Tier 1 entries formatted for prompt (XML document format) ─────
    if (action === 'get_prompt_kb') {
      const { userId } = body;
      if (!userId) {
        return { statusCode: 400, headers, body: JSON.stringify({ error: 'userId required' }) };
      }

      const { data, error } = await supabase
        .from('knowledge_base')
        .select('title, content, category')
        .eq('user_id', userId)
        .eq('tier', 'prompt')
        .eq('status', 'active')
        .order('category', { ascending: true });

      if (error) throw error;

      // Format as XML-in-markdown knowledge base for optimal retrieval
      // Each entry becomes a numbered document with title and category
      const entries = data || [];
      let promptText = '';

      if (entries.length > 0) {
        promptText = '<knowledge_base>\n';
        for (let i = 0; i < entries.length; i++) {
          const entry = entries[i];
          const content = entry.content || '';
          // If content already has XML document tags, include as-is
          if (content.includes('<document')) {
            promptText += content + '\n';
          } else {
            // Wrap plain content in XML document format
            promptText += `<document index="${i + 1}" title="${(entry.title || '').replace(/"/g, '&quot;')}" category="${entry.category || 'general'}">
Q: ${entry.title}
A: ${content}
</document>\n`;
          }
        }
        promptText += '</knowledge_base>';
      }

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ success: true, promptText: promptText.trim(), entryCount: entries.length }),
      };
    }

    // ─── LIST: List all KB entries for a user ───────────────────────
    if (action === 'list') {
      const { userId } = body;
      if (!userId) {
        return { statusCode: 400, headers, body: JSON.stringify({ error: 'userId required' }) };
      }

      const { data, error } = await supabase
        .from('knowledge_base')
        .select('id, title, content, category, tier, tags, status, usage_count, created_at, updated_at')
        .eq('user_id', userId)
        .order('tier', { ascending: true })
        .order('category', { ascending: true });

      if (error) throw error;
      return { statusCode: 200, headers, body: JSON.stringify({ success: true, entries: data || [] }) };
    }

    // ─── DELETE: Delete a KB entry ──────────────────────────────────
    if (action === 'delete') {
      const { id, userId } = body;
      if (!id || !userId) {
        return { statusCode: 400, headers, body: JSON.stringify({ error: 'id and userId required' }) };
      }

      const { error } = await supabase
        .from('knowledge_base')
        .delete()
        .eq('id', id)
        .eq('user_id', userId);

      if (error) throw error;
      return { statusCode: 200, headers, body: JSON.stringify({ success: true }) };
    }

    // ─── UPDATE: Update a KB entry and re-embed ─────────────────────
    if (action === 'update') {
      const { id, userId, title, content, category, tier } = body;
      if (!id || !userId) {
        return { statusCode: 400, headers, body: JSON.stringify({ error: 'id and userId required' }) };
      }

      const updates: any = { updated_at: new Date().toISOString() };
      if (title) updates.title = title;
      if (content) updates.content = content;
      if (category) updates.category = category;
      if (tier) updates.tier = tier;

      // Re-embed if content changed and it's a search-tier entry
      if (content && (tier || 'search') === 'search') {
        const embedding = await getEmbedding(`${title || ''}\n${content}`);
        if (embedding) updates.embedding = JSON.stringify(embedding);
      }

      const { data, error } = await supabase
        .from('knowledge_base')
        .update(updates)
        .eq('id', id)
        .eq('user_id', userId)
        .select('id, title, tier')
        .single();

      if (error) throw error;
      return { statusCode: 200, headers, body: JSON.stringify({ success: true, entry: data }) };
    }

    return { statusCode: 400, headers, body: JSON.stringify({ error: 'Invalid action. Use: search, add, add_batch, get_prompt_kb, list, delete, update' }) };

  } catch (err) {
    const errMsg = err instanceof Error ? err.message : (typeof err === 'object' ? JSON.stringify(err) : String(err));
    console.error('[kb-search] Error:', errMsg);
    await notifyError('kb-search: Failed', errMsg);
    return { statusCode: 500, headers, body: JSON.stringify({ error: errMsg }) };
  }
};
