import { Handler } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';
import Retell from 'retell-sdk';
import { notifyError } from './_shared/notify';
import { getSupabase } from './_shared/token-utils';
import { fireWebhooks } from './_shared/fire-webhooks';
import { authenticateApiKey } from './_shared/validate-api-key';
import { verifyFacebookSignature } from './_shared/verify-signatures';

/**
 * Lead Webhook — receives leads from external sources and inserts into Supabase `leads` table.
 *
 * Supported sources:
 *   1. Generic / Web Form (POST): { name, email, phone, source, user_id }
 *   2. Facebook Leadgen webhook (POST): { entry[].changes[].value.leadgen_id }
 *   3. Facebook webhook verification (GET): hub.mode, hub.verify_token, hub.challenge
 *
 * Environment variables:
 *   - SUPABASE_URL (or VITE_SUPABASE_URL) — Supabase project URL
 *   - SUPABASE_SERVICE_KEY — Supabase service-role key (NOT the anon key)
 *   - FB_APP_ID — Facebook App ID (for fetching lead details)
 *   - FB_WEBHOOK_VERIFY_TOKEN — shared secret for Facebook webhook verification
 *   - WEBHOOK_SECRET — (optional) global shared secret for form-based lead submissions
 *
 * Security model for generic/web-form submissions:
 *   - Requests authenticated via API key (Authorization: Bearer bc_...) are trusted — the
 *     authenticateApiKey helper validates the key and resolves the userId.
 *   - Unauthenticated requests that supply a raw user_id are validated by checking that the
 *     userId exists in business_profiles. This prevents unknown UUIDs from injecting fake leads.
 *   - Optionally, callers may also pass a `webhookSecret` field that must match WEBHOOK_SECRET.
 */

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Content-Type': 'application/json',
};

// Normalize incoming lead data from various formats into our leads table schema
// Table columns: id, source, first_name, last_name, email, phone, status, call_status,
// call_id, call_duration, sms_sent, sms_sid, raw_data, last_contact_at, created_at
function normalizeLead(body: any): Record<string, any> {
  // Parse name into first/last
  let firstName = body.first_name || '';
  let lastName = body.last_name || '';
  if (!firstName && !lastName) {
    const fullName = body.name || body.full_name || '';
    const parts = fullName.trim().split(/\s+/);
    firstName = parts[0] || '';
    lastName = parts.slice(1).join(' ') || '';
  }

  const lead: Record<string, any> = {
    first_name: firstName || null,
    last_name: lastName || null,
    email: body.email || null,
    phone: body.phone || body.phone_number || null,
    source: body.source || body.source_type || body.acquisition_source || 'website_form',
    status: body.status || 'pending',
    raw_data: body,
  };
  if (body.user_id) lead.user_id = body.user_id;
  return lead;
}

// Handle Facebook webhook verification (GET)
function handleFacebookVerification(params: Record<string, string | undefined>) {
  const mode = params['hub.mode'];
  const token = params['hub.verify_token'];
  const challenge = params['hub.challenge'];
  const verifyToken = process.env.FB_WEBHOOK_VERIFY_TOKEN;

  if (!verifyToken) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'FB_WEBHOOK_VERIFY_TOKEN not configured' }) };
  }

  if (mode === 'subscribe' && token === verifyToken) {
    // Facebook expects the raw challenge string, not JSON
    return {
      statusCode: 200,
      headers: { ...headers, 'Content-Type': 'text/plain' },
      body: challenge || '',
    };
  }

  return { statusCode: 403, headers, body: JSON.stringify({ error: 'Verification failed' }) };
}

// Fetch lead details from Facebook Graph API using leadgen_id
async function fetchFacebookLeadDetails(leadgenId: string, pageAccessToken: string): Promise<any> {
  const res = await fetch(
    `https://graph.facebook.com/v20.0/${leadgenId}?access_token=${pageAccessToken}`
  );
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    console.error('Facebook lead fetch failed:', err);
    return null;
  }
  return res.json();
}

// Parse Facebook lead field_data array into a flat object
function parseFacebookFieldData(fieldData: Array<{ name: string; values: string[] }>): Record<string, string> {
  const result: Record<string, string> = {};
  for (const field of fieldData || []) {
    result[field.name.toLowerCase()] = field.values?.[0] || '';
  }
  return result;
}

// Process a Facebook leadgen webhook payload
async function handleFacebookLeadgen(body: any, supabase: ReturnType<typeof createClient>) {
  const results: any[] = [];
  const errors: string[] = [];

  for (const entry of body.entry || []) {
    for (const change of entry.changes || []) {
      if (change.field !== 'leadgen') continue;

      const { leadgen_id, page_id } = change.value || {};
      if (!leadgen_id || !page_id) {
        errors.push('Missing leadgen_id or page_id in webhook payload');
        continue;
      }

      // Look up the page access token and associated user from facebook_page_connections
      const { data: connection, error: connErr } = await supabase
        .from('facebook_page_connections')
        .select('page_access_token, workspace_id, user_id')
        .eq('page_id', page_id)
        .limit(1)
        .single();

      if (connErr || !connection) {
        errors.push(`No facebook_page_connections found for page_id=${page_id}`);
        continue;
      }

      const userId = connection.user_id || connection.workspace_id;
      if (!userId) {
        errors.push(`No user_id or workspace_id found for page_id=${page_id}`);
        continue;
      }

      // Fetch the actual lead details from Facebook
      const leadDetails = await fetchFacebookLeadDetails(leadgen_id, connection.page_access_token);
      if (!leadDetails) {
        errors.push(`Failed to fetch lead details for leadgen_id=${leadgen_id}`);
        continue;
      }

      const fields = parseFacebookFieldData(leadDetails.field_data);

      // Parse name into first/last
      let fbFirstName = fields.first_name || '';
      let fbLastName = fields.last_name || '';
      if (!fbFirstName && !fbLastName && fields.full_name) {
        const parts = fields.full_name.trim().split(/\s+/);
        fbFirstName = parts[0] || '';
        fbLastName = parts.slice(1).join(' ') || '';
      }

      const leadRow: Record<string, any> = {
        first_name: fbFirstName || null,
        last_name: fbLastName || null,
        email: fields.email || null,
        phone: fields.phone_number || fields.phone || null,
        source: 'facebook_ads',
        status: 'pending',
        raw_data: { leadgen_id, page_id, fields },
      };
      if (userId) leadRow.user_id = userId;

      // Validate: need at least email or phone
      if (!leadRow.email && !leadRow.phone) {
        errors.push(`Lead ${leadgen_id} has no email or phone`);
        continue;
      }

      const { data, error: insertErr } = await supabase
        .from('leads')
        .insert(leadRow)
        .select()
        .single();

      if (insertErr) {
        errors.push(`Insert failed for leadgen_id=${leadgen_id}: ${insertErr.message}`);
      } else {
        results.push(data);
        // Fire user webhooks for Facebook leads
        if (userId && data) {
          fireWebhooks(userId, 'new_lead', {
            id: data.id,
            first_name: data.first_name,
            last_name: data.last_name,
            email: data.email,
            phone: data.phone,
            source: data.source,
            status: data.status,
            created_at: data.created_at,
          });
          // Instant response call — fire-and-forget, non-blocking
          if (data.phone) {
            triggerInstantResponseCall(userId, data.phone, 'facebook_ads', supabase).catch(() => {});
          }
        }
      }
    }
  }

  return { results, errors };
}

// Trigger an instant outbound Retell call for a new lead (fire-and-forget)
async function triggerInstantResponseCall(
  userId: string,
  toNumber: string,
  source: string,
  supabase: ReturnType<typeof createClient>
): Promise<void> {
  const retellApiKey = process.env.RETELL_API_KEY;
  if (!retellApiKey) return;

  const [{ data: agentRow }, { data: phoneRow }] = await Promise.all([
    supabase.from('agents').select('api_keys').eq('user_id', userId).limit(1).single(),
    supabase.from('phone_numbers').select('phone_number').eq('user_id', userId).eq('status', 'active').limit(1).single(),
  ]);

  const agentId = (agentRow?.api_keys as any)?.retell_agent_id;
  const fromNumber = phoneRow?.phone_number;

  if (!agentId || !fromNumber) {
    console.warn(`[lead-webhook] No agent/phone for instant response, user=${userId}`);
    return;
  }

  try {
    const retell = new Retell({ apiKey: retellApiKey });
    await retell.call.createPhoneCall({
      from_number: fromNumber,
      to_number: toNumber,
      agent_id: agentId,
      metadata: { source, user_id: userId },
    });
    console.log(`[lead-webhook] Instant response call triggered to ${toNumber} (source=${source})`);
  } catch (err: any) {
    console.error('[lead-webhook] Instant response call failed (non-blocking):', err?.message || err);
  }
}

export const handler: Handler = async (event) => {
  // CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  // GET — Facebook webhook verification
  if (event.httpMethod === 'GET') {
    return handleFacebookVerification(event.queryStringParameters || {});
  }

  // POST — receive lead data
  if (event.httpMethod === 'POST') {
    let body: any;
    try {
      body = JSON.parse(event.body || '{}');
    } catch {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'Invalid JSON body' }) };
    }

    const supabase = getSupabase();

    // Detect Facebook leadgen webhook format
    if (body.object === 'page' && body.entry) {
      // Verify Facebook signature when configured. Same dev-friendly fallback as retell-webhook.
      const fbSig = verifyFacebookSignature(event.body || '', event.headers as Record<string, string | undefined>);
      if (fbSig === 'invalid') {
        console.warn('[lead-webhook] Invalid Facebook signature — rejecting');
        return { statusCode: 401, headers, body: JSON.stringify({ error: 'Invalid X-Hub-Signature-256' }) };
      }
      if (fbSig === 'missing' && process.env.NODE_ENV === 'production') {
        console.warn('[lead-webhook] Missing FB signature in production — rejecting');
        return { statusCode: 401, headers, body: JSON.stringify({ error: 'Webhook signature required' }) };
      }
      try {
        const { results, errors } = await handleFacebookLeadgen(body, supabase);
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            success: true,
            leads_created: results.length,
            leads: results,
            errors: errors.length > 0 ? errors : undefined,
          }),
        };
      } catch (error) {
        console.error('Facebook leadgen processing error:', error);
        await notifyError('lead-webhook: Facebook leadgen processing failed', error);
        return {
          statusCode: 500,
          headers,
          body: JSON.stringify({
            error: 'Facebook lead processing failed. Our team has been notified.',
          }),
        };
      }
    }

    // Generic / Web Form lead submission
    // Resolve userId from API key if present (Zapier sends bc_ key)
    const auth = await authenticateApiKey(event.headers as Record<string, string>, event.queryStringParameters);
    if (auth.hasKey && !auth.userId) {
      return { statusCode: 401, headers, body: JSON.stringify({ error: auth.error || 'Invalid API key' }) };
    }
    if (auth.userId) body.user_id = auth.userId;

    // Path-based user_id: /.netlify/functions/lead-webhook/{user_id} or /l/{user_id}
    if (!body.user_id && event.path) {
      const uuidMatch = event.path.match(
        /([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/i,
      );
      if (uuidMatch) body.user_id = uuidMatch[1];
    }

    // Security: if a raw user_id was supplied without an API key, verify it belongs to a real
    // business_profiles row. This prevents anyone who guesses a UUID from injecting fake leads.
    if (!auth.hasKey && body.user_id) {
      // Optional global shared secret check
      const globalSecret = process.env.WEBHOOK_SECRET;
      if (globalSecret && body.webhookSecret !== globalSecret) {
        return { statusCode: 401, headers, body: JSON.stringify({ error: 'Unauthorized: invalid webhook secret' }) };
      }

      // Confirm the userId maps to a real user
      const { data: profile, error: profileErr } = await supabase
        .from('business_profiles')
        .select('user_id')
        .eq('user_id', body.user_id)
        .maybeSingle();

      if (profileErr || !profile) {
        return { statusCode: 401, headers, body: JSON.stringify({ error: 'Unauthorized: unknown user' }) };
      }
    }

    // Validate: need at least email or phone
    if (!body.email && !body.phone && !body.phone_number) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'At least one of email or phone is required' }),
      };
    }

    const lead = normalizeLead(body);

    try {
      const { data, error } = await supabase
        .from('leads')
        .insert(lead)
        .select()
        .single();

      if (error) {
        console.error('Supabase insert error:', error);
        await notifyError('lead-webhook: Lead insert failed', error, {
          source: lead.source, email: lead.email || 'none', phone: lead.phone || 'none',
        });
        return {
          statusCode: 500,
          headers,
          body: JSON.stringify({ error: 'Failed to insert lead. Our team has been notified.' }),
        };
      }

      // Fire user webhooks (Zapier, Make, etc.)
      if (lead.user_id && data) {
        fireWebhooks(lead.user_id, 'new_lead', {
          id: data.id,
          first_name: data.first_name,
          last_name: data.last_name,
          email: data.email,
          phone: data.phone,
          source: data.source,
          status: data.status,
          created_at: data.created_at,
        });
        // Instant response call — fire-and-forget, non-blocking
        if (data.phone) {
          triggerInstantResponseCall(lead.user_id, data.phone, lead.source || 'website_form', supabase).catch(() => {});
        }
      }

      // Sync lead to connected CRMs (fire-and-forget)
      if (lead.user_id) {
        const baseUrl = process.env.URL || process.env.DEPLOY_URL || 'https://boltcall.org';
        fetch(`${baseUrl}/.netlify/functions/integration-sync`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'sync_lead',
            userId: lead.user_id,
            lead: {
              name: body.name || null,
              first_name: lead.first_name || null,
              last_name: lead.last_name || null,
              phone: lead.phone || null,
              email: lead.email || null,
              source: lead.source || 'web_form',
              status: lead.status || 'new',
              notes: body.notes || body.message || null,
            },
          }),
        }).catch(err => {
          console.error('[lead-webhook] CRM sync failed (non-blocking):', err);
        });
      }

      return {
        statusCode: 201,
        headers,
        body: JSON.stringify({ success: true, lead: data }),
      };
    } catch (error) {
      console.error('Lead webhook error:', error);
      await notifyError('lead-webhook: Unhandled exception', error);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          error: 'Lead processing failed. Our team has been notified.',
        }),
      };
    }
  }

  return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
};
