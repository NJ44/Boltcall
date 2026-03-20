import { Handler } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';
import { notifyError } from './_shared/notify';

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
 */

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Content-Type': 'application/json',
};

function getSupabase() {
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_KEY;
  if (!url || !key) {
    throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_KEY');
  }
  return createClient(url, key);
}

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
      }
    }
  }

  return { results, errors };
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
    // user_id is optional but recommended for per-user lead filtering

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
