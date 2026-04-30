import { Handler } from '@netlify/functions';
import { extractApiKey, validateApiKey } from './_shared/validate-api-key';
import { getSupabase } from './_shared/token-utils';

/**
 * GET /api/api-leads
 *
 * Zapier polling trigger endpoint.
 * Returns an array of leads for the authenticated user, sorted newest-first.
 * Zapier deduplicates by `id` so it only triggers on truly new leads.
 *
 * Auth: API key via Authorization header (Bearer bc_...) or ?api_key=bc_...
 */

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Content-Type': 'application/json',
};

export const handler: Handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  const apiKey = extractApiKey(
    event.headers as Record<string, string>,
    event.queryStringParameters
  );

  if (!apiKey) {
    return {
      statusCode: 401,
      headers,
      body: JSON.stringify({ error: 'Missing API key' }),
    };
  }

  const validation = await validateApiKey(apiKey);

  if (!validation.valid || !validation.userId) {
    return {
      statusCode: 401,
      headers,
      body: JSON.stringify({ error: validation.error || 'Invalid API key' }),
    };
  }

  const supabase = getSupabase();

  const { data: leads, error } = await supabase
    .from('leads')
    .select(
      'id, first_name, last_name, email, phone, source, status, call_status, call_duration, sms_sent, created_at'
    )
    .eq('user_id', validation.userId)
    .order('created_at', { ascending: false })
    .limit(100);

  if (error) {
    console.error('api-leads query error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Failed to fetch leads' }),
    };
  }

  // Zapier expects a top-level array
  return {
    statusCode: 200,
    headers,
    body: JSON.stringify(leads || []),
  };
};
