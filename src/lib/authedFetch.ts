import { supabase } from './supabase';

/**
 * fetch() wrapper that attaches the current Supabase access token as
 * `Authorization: Bearer <jwt>`.
 *
 * Use for any call to a Netlify function that requires authentication —
 * `retell-agents`, `retell-calls`, `twilio-numbers`, `kb-search`, etc.
 *
 * If no session exists, the request still goes out without an Authorization
 * header so the server can return 401 explicitly (rather than failing here).
 */
export async function authedFetch(input: RequestInfo | URL, init: RequestInit = {}): Promise<Response> {
  const { data: { session } } = await supabase.auth.getSession();
  const headers = new Headers(init.headers || {});
  if (session?.access_token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${session.access_token}`);
  }
  return fetch(input, { ...init, headers });
}
