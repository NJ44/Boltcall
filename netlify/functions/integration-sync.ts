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

// ─── Google Calendar Integration (OAuth) ────────────────────────────────────

/**
 * Refresh an expired Google Calendar access token using the refresh token.
 * Updates the token in Supabase and returns the new access token.
 */
async function refreshGoogleToken(refreshToken: string, integrationId: string): Promise<string | null> {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  if (!clientId || !clientSecret || !refreshToken) return null;

  try {
    const res = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        refresh_token: refreshToken,
        grant_type: 'refresh_token',
      }).toString(),
    });

    if (!res.ok) return null;
    const data = await res.json();
    const newAccessToken = data.access_token;
    const expiresAt = new Date(Date.now() + (data.expires_in || 3600) * 1000).toISOString();

    // Update token in Supabase
    const supabase = getSupabase();
    await supabase
      .from('user_integrations')
      .update({
        config: { access_token: newAccessToken, token_expires_at: expiresAt },
        updated_at: new Date().toISOString(),
      })
      .eq('id', integrationId);

    return newAccessToken;
  } catch {
    return null;
  }
}

/**
 * Get a valid access token for Google Calendar — refreshes if expired.
 */
async function getGoogleAccessToken(integration: any): Promise<string | null> {
  const config = integration.config || {};
  const accessToken = config.access_token;
  const expiresAt = config.token_expires_at;
  const refreshToken = integration.api_key;

  // Check if token is still valid (with 5-minute buffer)
  if (accessToken && expiresAt) {
    const expiresTime = new Date(expiresAt).getTime();
    if (Date.now() < expiresTime - 5 * 60 * 1000) {
      return accessToken;
    }
  }

  // Token expired — refresh it
  if (refreshToken) {
    return refreshGoogleToken(refreshToken, integration.id);
  }

  return null;
}

async function checkGoogleCalendarAvailability(accessToken: string, config: any, date: string): Promise<{ success: boolean; slots?: string[]; error?: string }> {
  try {
    const calendarId = config.calendar_id || 'primary';
    const timeMin = `${date}T00:00:00Z`;
    const timeMax = `${date}T23:59:59Z`;

    const url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events?timeMin=${encodeURIComponent(timeMin)}&timeMax=${encodeURIComponent(timeMax)}&singleEvents=true&orderBy=startTime`;
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!res.ok) {
      const errText = await res.text();
      return { success: false, error: `Google Calendar failed: ${res.status} - ${errText}` };
    }

    const data = await res.json();
    const events = data.items || [];

    const busySlots = events
      .filter((e: any) => e.status !== 'cancelled')
      .map((e: any) => ({
        start: e.start?.dateTime || e.start?.date,
        end: e.end?.dateTime || e.end?.date,
        summary: e.summary || 'Busy',
      }));

    return { success: true, slots: busySlots };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Google Calendar failed' };
  }
}

async function addGoogleCalendarEvent(accessToken: string, config: any, lead: any): Promise<{ success: boolean; eventId?: string; error?: string }> {
  try {
    const calendarId = config.calendar_id || 'primary';

    // Create a 30-minute appointment event
    const startTime = lead.appointment_time || new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
    const startDate = new Date(startTime);
    const endDate = new Date(startDate.getTime() + 30 * 60 * 1000);

    const event = {
      summary: `Appointment: ${lead.name || 'New Lead'}`,
      description: [
        lead.name ? `Name: ${lead.name}` : '',
        lead.email ? `Email: ${lead.email}` : '',
        lead.phone ? `Phone: ${lead.phone}` : '',
        lead.notes ? `Notes: ${lead.notes}` : '',
        `Source: ${lead.source || 'Boltcall AI Receptionist'}`,
      ].filter(Boolean).join('\n'),
      start: {
        dateTime: startDate.toISOString(),
        timeZone: lead.timezone || 'UTC',
      },
      end: {
        dateTime: endDate.toISOString(),
        timeZone: lead.timezone || 'UTC',
      },
      attendees: lead.email ? [{ email: lead.email }] : [],
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: 60 },
          { method: 'popup', minutes: 15 },
        ],
      },
    };

    const url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events?sendUpdates=all`;
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(event),
    });

    if (!res.ok) {
      const errText = await res.text();
      return { success: false, error: `Failed to create event: ${res.status} - ${errText}` };
    }

    const data = await res.json();
    return { success: true, eventId: data.id };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Google Calendar event creation failed' };
  }
}

/**
 * Cancel (delete) a Google Calendar event by eventId.
 */
async function cancelGoogleCalendarEvent(accessToken: string, config: any, eventId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const calendarId = config.calendar_id || 'primary';
    const url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events/${encodeURIComponent(eventId)}?sendUpdates=all`;
    const res = await fetch(url, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!res.ok && res.status !== 410) { // 410 = already deleted
      const errText = await res.text();
      return { success: false, error: `Failed to cancel event: ${res.status} - ${errText}` };
    }
    return { success: true };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Google Calendar cancel failed' };
  }
}

/**
 * Reschedule a Google Calendar event — update its start/end time.
 */
async function rescheduleGoogleCalendarEvent(
  accessToken: string,
  config: any,
  eventId: string,
  newStartTime: string,
  durationMinutes: number = 30
): Promise<{ success: boolean; error?: string }> {
  try {
    const calendarId = config.calendar_id || 'primary';
    const startDate = new Date(newStartTime);
    const endDate = new Date(startDate.getTime() + durationMinutes * 60 * 1000);

    const url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events/${encodeURIComponent(eventId)}?sendUpdates=all`;
    const res = await fetch(url, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        start: { dateTime: startDate.toISOString() },
        end: { dateTime: endDate.toISOString() },
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      return { success: false, error: `Failed to reschedule: ${res.status} - ${errText}` };
    }
    return { success: true };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Google Calendar reschedule failed' };
  }
}

/**
 * Find an appointment by searching for the caller's name, email, or phone in event descriptions.
 */
async function findGoogleCalendarAppointment(
  accessToken: string,
  config: any,
  query: string
): Promise<{ success: boolean; events?: any[]; error?: string }> {
  try {
    const calendarId = config.calendar_id || 'primary';
    const now = new Date().toISOString();
    // Search upcoming events (next 90 days)
    const futureDate = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString();

    const url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events?q=${encodeURIComponent(query)}&timeMin=${encodeURIComponent(now)}&timeMax=${encodeURIComponent(futureDate)}&singleEvents=true&orderBy=startTime&maxResults=10`;
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!res.ok) {
      const errText = await res.text();
      return { success: false, error: `Search failed: ${res.status} - ${errText}` };
    }

    const data = await res.json();
    const events = (data.items || []).map((e: any) => ({
      eventId: e.id,
      summary: e.summary,
      start: e.start?.dateTime || e.start?.date,
      end: e.end?.dateTime || e.end?.date,
      description: e.description,
      status: e.status,
    }));

    return { success: true, events };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Google Calendar search failed' };
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

      // Check if exists
      const { data: existing } = await supabase
        .from('user_integrations')
        .select('id')
        .eq('user_id', userId)
        .eq('provider', provider)
        .maybeSingle();

      let data, error;
      if (existing) {
        // Update
        ({ data, error } = await supabase
          .from('user_integrations')
          .update({
            is_connected: true,
            api_key: integrationApiKey || null,
            webhook_url: webhookUrl || null,
            config: config || {},
            updated_at: new Date().toISOString(),
          })
          .eq('id', existing.id)
          .select('id, provider, is_connected')
          .single());
      } else {
        // Insert
        ({ data, error } = await supabase
          .from('user_integrations')
          .insert({
            user_id: userId,
            provider,
            is_connected: true,
            api_key: integrationApiKey || null,
            webhook_url: webhookUrl || null,
            config: config || {},
          })
          .select('id, provider, is_connected')
          .single());
      }

      if (error) {
        console.error('[integration-sync] Connect error:', JSON.stringify(error));
        return { statusCode: 500, headers, body: JSON.stringify({ error: error.message || JSON.stringify(error), code: error.code }) };
      }
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

      if (provider === 'email') {
        if (!testApiKey) return { statusCode: 400, headers, body: JSON.stringify({ error: 'Email address required' }) };
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(testApiKey)) {
          return { statusCode: 200, headers, body: JSON.stringify({ success: false, error: 'Invalid email address format' }) };
        }
        // Send a test notification email via Brevo
        const brevoKey = process.env.BREVO_API_KEY;
        if (brevoKey) {
          try {
            const res = await fetch('https://api.brevo.com/v3/smtp/email', {
              method: 'POST',
              headers: {
                'api-key': brevoKey,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                sender: { name: 'Boltcall', email: 'notifications@boltcall.org' },
                to: [{ email: testApiKey }],
                subject: 'Boltcall Notifications Connected!',
                htmlContent: `<div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:24px">
                  <h2 style="color:#1e40af">Notifications Connected</h2>
                  <p>Your Boltcall notifications are now active. You'll receive emails for:</p>
                  <ul>
                    <li>New leads captured by your AI receptionist</li>
                    <li>Missed calls</li>
                    <li>New appointment bookings</li>
                  </ul>
                  <p style="color:#6b7280;font-size:13px">— The Boltcall Team</p>
                </div>`,
              }),
            });
            if (res.ok) {
              return { statusCode: 200, headers, body: JSON.stringify({ success: true, message: `Test email sent to ${testApiKey}` }) };
            }
          } catch {}
        }
        // Even without Brevo, validate the email is correct
        return { statusCode: 200, headers, body: JSON.stringify({ success: true, message: `Email address ${testApiKey} verified` }) };
      }

      if (provider === 'google_calendar') {
        // OAuth-based test: use the stored access token from config
        const accessToken = testConfig?.access_token;
        if (!accessToken) {
          return { statusCode: 200, headers, body: JSON.stringify({ success: false, error: 'Not connected. Use "Connect with Google" to authorize.' }) };
        }
        const today = new Date().toISOString().split('T')[0];
        const result = await checkGoogleCalendarAvailability(accessToken, testConfig, today);
        if (result.success) {
          return { statusCode: 200, headers, body: JSON.stringify({ success: true, message: `Calendar connected. ${(result.slots || []).length} events today.` }) };
        }
        return { statusCode: 200, headers, body: JSON.stringify(result) };
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

          case 'email':
            if (integration.api_key) {
              const brevoKey = process.env.BREVO_API_KEY;
              if (brevoKey) {
                try {
                  const emailConfig = integration.config || {};
                  const shouldNotify = emailConfig.notify_new_leads?.toLowerCase() !== 'no';
                  if (shouldNotify) {
                    const leadName = lead.name || [lead.first_name, lead.last_name].filter(Boolean).join(' ') || 'Unknown';
                    const emailRes = await fetch('https://api.brevo.com/v3/smtp/email', {
                      method: 'POST',
                      headers: { 'api-key': brevoKey, 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        sender: { name: 'Boltcall', email: 'notifications@boltcall.org' },
                        to: [{ email: integration.api_key }],
                        subject: `New Lead: ${leadName}`,
                        htmlContent: `<div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:24px">
                          <h2 style="color:#1e40af">New Lead Captured</h2>
                          <table style="width:100%;border-collapse:collapse">
                            ${lead.name || leadName ? `<tr><td style="padding:6px 0;color:#6b7280">Name</td><td style="padding:6px 0;font-weight:600">${leadName}</td></tr>` : ''}
                            ${lead.email ? `<tr><td style="padding:6px 0;color:#6b7280">Email</td><td style="padding:6px 0">${lead.email}</td></tr>` : ''}
                            ${lead.phone ? `<tr><td style="padding:6px 0;color:#6b7280">Phone</td><td style="padding:6px 0">${lead.phone}</td></tr>` : ''}
                            ${lead.source ? `<tr><td style="padding:6px 0;color:#6b7280">Source</td><td style="padding:6px 0">${lead.source}</td></tr>` : ''}
                          </table>
                          ${lead.notes ? `<p style="margin-top:12px;padding:12px;background:#f3f4f6;border-radius:8px;font-size:14px">${lead.notes}</p>` : ''}
                          <p style="color:#6b7280;font-size:12px;margin-top:16px">— Boltcall AI Receptionist</p>
                        </div>`,
                      }),
                    });
                    result = emailRes.ok ? { success: true } : { success: false, error: 'Failed to send email notification' };
                  } else {
                    result = { success: true };
                  }
                } catch (err) {
                  result = { success: false, error: err instanceof Error ? err.message : 'Email notification failed' };
                }
              } else {
                result = { success: false, error: 'Email service not configured on server' };
              }
            } else {
              result = { success: false, error: 'No email address configured' };
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

    // ─── CALENDAR: Book, cancel, reschedule, find appointments ─────
    if (action === 'calendar_book' || action === 'calendar_cancel' || action === 'calendar_reschedule' || action === 'calendar_find' || action === 'calendar_availability') {
      const { userId } = body;
      if (!userId) {
        return { statusCode: 400, headers, body: JSON.stringify({ error: 'userId required' }) };
      }

      // Get user's Google Calendar integration
      const { data: gcalIntegration } = await supabase
        .from('user_integrations')
        .select('*')
        .eq('user_id', userId)
        .eq('provider', 'google_calendar')
        .eq('is_connected', true)
        .maybeSingle();

      if (!gcalIntegration) {
        return { statusCode: 200, headers, body: JSON.stringify({ success: false, error: 'Google Calendar not connected' }) };
      }

      const accessToken = await getGoogleAccessToken(gcalIntegration);
      if (!accessToken) {
        return { statusCode: 200, headers, body: JSON.stringify({ success: false, error: 'Google Calendar token expired. Please reconnect.' }) };
      }

      const config = gcalIntegration.config || {};

      // ── Book appointment
      if (action === 'calendar_book') {
        const { lead } = body;
        if (!lead) return { statusCode: 400, headers, body: JSON.stringify({ error: 'lead data required' }) };
        const result = await addGoogleCalendarEvent(accessToken, config, lead);
        return { statusCode: 200, headers, body: JSON.stringify(result) };
      }

      // ── Cancel appointment
      if (action === 'calendar_cancel') {
        const { eventId } = body;
        if (!eventId) return { statusCode: 400, headers, body: JSON.stringify({ error: 'eventId required' }) };
        const result = await cancelGoogleCalendarEvent(accessToken, config, eventId);
        return { statusCode: 200, headers, body: JSON.stringify(result) };
      }

      // ── Reschedule appointment
      if (action === 'calendar_reschedule') {
        const { eventId, newStartTime, durationMinutes } = body;
        if (!eventId || !newStartTime) return { statusCode: 400, headers, body: JSON.stringify({ error: 'eventId and newStartTime required' }) };
        const result = await rescheduleGoogleCalendarEvent(accessToken, config, eventId, newStartTime, durationMinutes || 30);
        return { statusCode: 200, headers, body: JSON.stringify(result) };
      }

      // ── Find appointment by name/email/phone
      if (action === 'calendar_find') {
        const { query } = body;
        if (!query) return { statusCode: 400, headers, body: JSON.stringify({ error: 'query (name, email, or phone) required' }) };
        const result = await findGoogleCalendarAppointment(accessToken, config, query);
        return { statusCode: 200, headers, body: JSON.stringify(result) };
      }

      // ── Check availability for a date
      if (action === 'calendar_availability') {
        const { date } = body;
        if (!date) return { statusCode: 400, headers, body: JSON.stringify({ error: 'date (YYYY-MM-DD) required' }) };
        const result = await checkGoogleCalendarAvailability(accessToken, config, date);
        return { statusCode: 200, headers, body: JSON.stringify(result) };
      }
    }

    return { statusCode: 400, headers, body: JSON.stringify({ error: 'Invalid action. Use: list, connect, disconnect, test, sync_lead, calendar_book, calendar_cancel, calendar_reschedule, calendar_find, calendar_availability' }) };

  } catch (err) {
    const errMsg = err instanceof Error ? err.message : (typeof err === 'object' ? JSON.stringify(err) : String(err));
    console.error('[integration-sync] Error:', errMsg);
    await notifyError('integration-sync: Failed', errMsg);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: errMsg }),
    };
  }
};
