/**
 * Unified server-side auth gate for Netlify functions.
 *
 * Accepts either:
 *   - Authorization: Bearer <supabase-jwt>   (dashboard requests)
 *   - Authorization: Bearer bc_...           (API key, e.g. Zapier)
 *   - ?api_key=bc_...                        (query param fallback)
 *
 * Returns a resolved userId (auth.users.id from Supabase, or workspace_id from
 * the api_keys row) or a 401 response shape that handlers can return directly.
 *
 * Usage:
 *   const auth = await requireAuth(event);
 *   if (!auth.ok) return auth.response;
 *   const userId = auth.userId;
 */
import type { HandlerEvent } from '@netlify/functions';
import { getSupabase } from './token-utils';
import { extractApiKey, validateApiKey } from './validate-api-key';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Content-Type': 'application/json',
};

export type AuthResult =
  | { ok: true; userId: string; source: 'jwt' | 'api_key'; keyName?: string }
  | { ok: false; response: { statusCode: number; headers: Record<string, string>; body: string } };

function unauthorized(message: string, extraHeaders: Record<string, string> = {}): AuthResult {
  return {
    ok: false,
    response: {
      statusCode: 401,
      headers: { ...CORS_HEADERS, ...extraHeaders },
      body: JSON.stringify({ error: message }),
    },
  };
}

export async function requireAuth(event: HandlerEvent): Promise<AuthResult> {
  const headers = (event.headers as Record<string, string | undefined>) || {};
  const queryParams = (event.queryStringParameters as Record<string, string | undefined> | null) || null;

  // 1. API key path — explicit bc_ token
  const rawKey = extractApiKey(headers, queryParams);
  if (rawKey) {
    const result = await validateApiKey(rawKey);
    if (!result.valid || !result.userId) {
      return unauthorized(result.error || 'Invalid API key');
    }
    return { ok: true, userId: result.userId, source: 'api_key', keyName: result.keyName || undefined };
  }

  // 2. JWT path — Supabase access token
  const authHeader = headers.authorization || headers.Authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return unauthorized('Authentication required');
  }

  const token = authHeader.substring(7);
  const supabase = getSupabase();
  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data?.user) {
    return unauthorized('Invalid or expired token');
  }
  return { ok: true, userId: data.user.id, source: 'jwt' };
}

/**
 * Returns the list of Retell agent_ids owned by a user (workspace).
 * Used to scope retell-agents/retell-calls listings to a single tenant.
 */
export async function getUserAgentIds(userId: string): Promise<string[]> {
  const supabase = getSupabase();
  const { data } = await supabase
    .from('agents')
    .select('api_keys')
    .eq('user_id', userId);
  return (data || [])
    .map((row: any) => row.api_keys?.retell_agent_id)
    .filter((id: unknown): id is string => typeof id === 'string' && id.length > 0);
}

/**
 * Returns true if the given Retell agent_id is owned by the user.
 */
export async function userOwnsAgent(userId: string, agentId: string): Promise<boolean> {
  if (!agentId) return false;
  const ids = await getUserAgentIds(userId);
  return ids.includes(agentId);
}

/**
 * Returns the E.164 phone numbers owned by a user (workspace).
 * The phone_numbers table is keyed by phone_number; Twilio SID is not
 * guaranteed to be stored locally.
 */
export async function getUserPhoneNumbers(userId: string): Promise<string[]> {
  const supabase = getSupabase();
  const { data } = await supabase
    .from('phone_numbers')
    .select('phone_number')
    .eq('user_id', userId);
  return (data || [])
    .map((row: any) => row.phone_number)
    .filter((n: unknown): n is string => typeof n === 'string' && n.length > 0);
}

/**
 * Returns true if the given E.164 phone number is owned by the user.
 */
export async function userOwnsPhoneNumber(userId: string, phoneNumber: string): Promise<boolean> {
  if (!phoneNumber) return false;
  const numbers = await getUserPhoneNumbers(userId);
  return numbers.includes(phoneNumber);
}
