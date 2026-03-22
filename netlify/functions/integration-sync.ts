import { Handler } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';
import { notifyError, notifyInfo } from './_shared/notify';

/**
 * Integration Sync Function
 *
 * Actions:
 *   - list: Get all integrations for a user
 *   - connect: Save/update an integration connection
 *   - disconnect: Remove an integration
 *   - sync_lead: Push a lead to all connected CRMs for a user
 *   - test: Test a specific integration connection
 */

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json',
};

function getSupabase() {
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_KEY;
  if (!url || !key) throw new Error('Missing Supabase credentials');
  return createClient(url, key);
}

// ─── HubSpot Integration ────────────────────────────────────────────────────

async function syncToHubSpot(apiKey: string, lead: any): Promise<{ success: boolean; contactId?: string; error?: string }> {
  try {
    // Check if contact exists by email or phone
    let existingId: string | null = null;

    if (lead.email) {
      const searchRes = await fetch('https://api.hubapi.com/crm/v3/objects/contacts/search', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          filterGroups: [{ filters: [{ propertyName: 'email', operator: 'EQ', value: lead.email }] }],
        }),
      });
      if (searchRes.ok) {
        const searchData = await searchRes.json();
        if (searchData.results?.length > 0) existingId = searchData.results[0].id;
      }
    }

    const properties: Record<string, string> = {
      firstname: lead.first_name || lead.name?.split(' ')[0] || '',
      lastname: lead.last_name || lead.name?.split(' ').slice(1).join(' ') || '',
      phone: lead.phone || '',
      email: lead.email || '',
      hs_lead_status: 'NEW',
      lifecyclestage: 'lead',
    };

    if (lead.source) properties.leadsource = lead.source;
    if (lead.notes) properties.notes_last_updated = lead.notes;

    if (existingId) {
      // Update existing contact
      const res = await fetch(`https://api.hubapi.com/crm/v3/objects/contacts/${existingId}`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ properties }),
      });
      if (!res.ok) throw new Error(`HubSpot update failed: ${res.status}`);
      return { success: true, contactId: existingId };
    } else {
      // Create new contact
      const res = await fetch('https://api.hubapi.com/crm/v3/objects/contacts', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ properties }),
      });
      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`HubSpot create failed: ${res.status} - ${errText}`);
      }
      const data = await res.json();
      return { success: true, contactId: data.id };
    }
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'HubSpot sync failed' };
  }
}

// ─── Zapier Webhook Integration ─────────────────────────────────────────────

async function syncToZapier(webhookUrl: string, lead: any, eventType: string): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event: eventType,
        timestamp: new Date().toISOString(),
        lead: {
          name: lead.name || [lead.first_name, lead.last_name].filter(Boolean).join(' '),
          first_name: lead.first_name || '',
          last_name: lead.last_name || '',
          email: lead.email || '',
          phone: lead.phone || '',
          source: lead.source || 'ai_receptionist',
          status: lead.status || 'new',
          notes: lead.notes || '',
        },
      }),
    });
    if (!res.ok) throw new Error(`Zapier webhook failed: ${res.status}`);
    return { success: true };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Zapier sync failed' };
  }
}

// ─── Google Sheets Integration ──────────────────────────────────────────────

async function syncToGoogleSheets(apiKey: string, config: any, lead: any): Promise<{ success: boolean; error?: string }> {
  try {
    const spreadsheetId = config.spreadsheet_id;
    const sheetName = config.sheet_name || 'Leads';

    if (!spreadsheetId) return { success: false, error: 'No spreadsheet ID configured' };

    const values = [[
      new Date().toISOString(),
      lead.name || [lead.first_name, lead.last_name].filter(Boolean).join(' '),
      lead.email || '',
      lead.phone || '',
      lead.source || 'ai_receptionist',
      lead.status || 'new',
      lead.notes || '',
    ]];

    const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${sheetName}!A:G:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS&key=${apiKey}`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ values }),
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Google Sheets failed: ${res.status} - ${errText}`);
    }
    return { success: true };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Google Sheets sync failed' };
  }
}

// ─── Main Handler ───────────────────────────────────────────────────────────

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

    // ─── LIST: Get all integrations for a user ──────────────────────
    if (action === 'list') {
      const { userId } = body;
      if (!userId) return { statusCode: 400, headers, body: JSON.stringify({ error: 'userId required' }) };

      const { data, error } = await supabase
        .from('user_integrations')
        .select('id, provider, is_connected, config, last_sync_at, sync_count, created_at')
        .eq('user_id', userId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return { statusCode: 200, headers, body: JSON.stringify({ success: true, integrations: data || [] }) };
    }

    // ─── CONNECT: Save/update an integration ────────────────────────
    if (action === 'connect') {
      const { userId, provider, apiKey: integrationApiKey, webhookUrl, config } = body;
      if (!userId || !provider) {
        return { statusCode: 400, headers, body: JSON.stringify({ error: 'userId and provider required' }) };
      }

      const { data, error } = await supabase
        .from('user_integrations')
        .upsert({
          user_id: userId,
          provider,
          is_connected: true,
          api_key: integrationApiKey || null,
          webhook_url: webhookUrl || null,
          config: config || {},
          updated_at: new Date().toISOString(),
        }, { onConflict: 'user_id,provider' })
        .select('id, provider, is_connected')
        .single();

      if (error) throw error;
      return { statusCode: 200, headers, body: JSON.stringify({ success: true, integration: data }) };
    }

    // ─── DISCONNECT: Remove an integration ──────────────────────────
    if (action === 'disconnect') {
      const { userId, provider } = body;
      if (!userId || !provider) {
        return { statusCode: 400, headers, body: JSON.stringify({ error: 'userId and provider required' }) };
      }

      const { error } = await supabase
        .from('user_integrations')
        .update({ is_connected: false, api_key: null, webhook_url: null, updated_at: new Date().toISOString() })
        .eq('user_id', userId)
        .eq('provider', provider);

      if (error) throw error;
      return { statusCode: 200, headers, body: JSON.stringify({ success: true }) };
    }

    // ─── TEST: Test a specific integration connection ───────────────
    if (action === 'test') {
      const { provider, apiKey: testApiKey, webhookUrl: testWebhookUrl, config: testConfig } = body;

      if (provider === 'hubspot') {
        if (!testApiKey) return { statusCode: 400, headers, body: JSON.stringify({ error: 'apiKey required for HubSpot' }) };
        const res = await fetch('https://api.hubapi.com/crm/v3/objects/contacts?limit=1', {
          headers: { 'Authorization': `Bearer ${testApiKey}` },
        });
        if (res.ok) {
          return { statusCode: 200, headers, body: JSON.stringify({ success: true, message: 'HubSpot connection verified' }) };
        }
        return { statusCode: 200, headers, body: JSON.stringify({ success: false, error: `HubSpot auth failed: ${res.status}` }) };
      }

      if (provider === 'zapier') {
        if (!testWebhookUrl) return { statusCode: 400, headers, body: JSON.stringify({ error: 'webhookUrl required for Zapier' }) };
        const result = await syncToZapier(testWebhookUrl, { name: 'Test Lead', email: 'test@boltcall.org', phone: '+447700000000', source: 'test' }, 'test');
        return { statusCode: 200, headers, body: JSON.stringify(result) };
      }

      if (provider === 'google_sheets') {
        if (!testApiKey || !testConfig?.spreadsheet_id) {
          return { statusCode: 400, headers, body: JSON.stringify({ error: 'apiKey and config.spreadsheet_id required' }) };
        }
        // Just check if the sheet is accessible
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${testConfig.spreadsheet_id}?key=${testApiKey}&fields=properties.title`;
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          return { statusCode: 200, headers, body: JSON.stringify({ success: true, message: `Connected to "${data.properties?.title}"` }) };
        }
        return { statusCode: 200, headers, body: JSON.stringify({ success: false, error: `Google Sheets access failed: ${res.status}` }) };
      }

      return { statusCode: 200, headers, body: JSON.stringify({ success: true, message: 'No test available for this provider' }) };
    }

    // ─── SYNC_LEAD: Push a lead to all connected CRMs for a user ────
    if (action === 'sync_lead') {
      const { userId, lead } = body;
      if (!userId || !lead) {
        return { statusCode: 400, headers, body: JSON.stringify({ error: 'userId and lead required' }) };
      }

      // Get all connected integrations for this user
      const { data: integrations, error: intError } = await supabase
        .from('user_integrations')
        .select('*')
        .eq('user_id', userId)
        .eq('is_connected', true);

      if (intError) throw intError;
      if (!integrations || integrations.length === 0) {
        return { statusCode: 200, headers, body: JSON.stringify({ success: true, synced: 0, message: 'No connected integrations' }) };
      }

      const results: Array<{ provider: string; success: boolean; error?: string }> = [];

      for (const integration of integrations) {
        let result: { success: boolean; error?: string } = { success: false, error: 'Unknown provider' };

        switch (integration.provider) {
          case 'hubspot':
            if (integration.api_key) {
              const hubResult = await syncToHubSpot(integration.api_key, lead);
              result = hubResult;
            } else {
              result = { success: false, error: 'No API key' };
            }
            break;

          case 'zapier':
            if (integration.webhook_url) {
              result = await syncToZapier(integration.webhook_url, lead, 'new_lead');
            } else {
              result = { success: false, error: 'No webhook URL' };
            }
            break;

          case 'google_sheets':
            if (integration.api_key) {
              result = await syncToGoogleSheets(integration.api_key, integration.config || {}, lead);
            } else {
              result = { success: false, error: 'No API key' };
            }
            break;

          default:
            result = { success: true, error: `Provider ${integration.provider} sync not implemented yet` };
        }

        results.push({ provider: integration.provider, ...result });

        // Update sync count and timestamp
        if (result.success) {
          await supabase
            .from('user_integrations')
            .update({
              last_sync_at: new Date().toISOString(),
              sync_count: (integration.sync_count || 0) + 1,
            })
            .eq('id', integration.id);
        }
      }

      const synced = results.filter(r => r.success).length;
      const failed = results.filter(r => !r.success);

      if (failed.length > 0) {
        console.error('[integration-sync] Some syncs failed:', failed);
      }

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ success: true, synced, total: results.length, results }),
      };
    }

    return { statusCode: 400, headers, body: JSON.stringify({ error: 'Invalid action. Use: list, connect, disconnect, test, sync_lead' }) };

  } catch (err) {
    console.error('[integration-sync] Error:', err);
    await notifyError('integration-sync: Failed', err);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: err instanceof Error ? err.message : 'Integration sync failed' }),
    };
  }
};
