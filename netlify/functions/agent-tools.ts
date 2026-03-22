import { Handler } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';
import { deductTokens, TOKEN_COSTS } from './_shared/token-utils';
import { notifyError, notifyInfo } from './_shared/notify';

/**
 * Agent Tools Webhook
 *
 * Called by Retell during live calls when the AI agent invokes a custom tool.
 * Handles: lookup_caller, check_availability, book_appointment, send_sms
 *
 * Retell sends:
 *   { call_id, agent_id, tool_call_id, name, arguments: { ... } }
 *
 * Must respond with:
 *   { tool_call_id, content: "..." }
 */

const CAL_API_KEY = process.env.CAL_API_KEY || 'cal_live_876a71577c2ff7baaca243a7e0178a83';
const CAL_BASE_URL = 'https://api.cal.com/v1';
const TWILIO_API_BASE = 'https://api.twilio.com/2010-04-01';

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json',
};

function getSupabase() {
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
  const key = process.env.SUPABASE_SERVICE_KEY || '';
  return createClient(url, key);
}

// ── Cal.com helpers ──

let cachedEventTypeId: number | null = null;

async function getEventTypeId(calApiKey: string): Promise<number | null> {
  if (cachedEventTypeId) return cachedEventTypeId;

  try {
    const response = await fetch(`${CAL_BASE_URL}/event-types?apiKey=${calApiKey}`);

    if (!response.ok) {
      console.error('[agent-tools] Failed to fetch event types:', response.status, await response.text());
      return null;
    }

    const data = await response.json();
    const eventTypes = data.event_types || data.data || [];
    if (eventTypes.length === 0) return null;

    // Prefer "Free Consultation" event type, fall back to first
    const consultation = eventTypes.find((e: any) =>
      e.title?.toLowerCase().includes('consultation') || e.slug?.includes('consultation')
    );
    cachedEventTypeId = consultation?.id || eventTypes[0].id;
    return cachedEventTypeId;
  } catch (err) {
    console.error('[agent-tools] Error fetching event types:', err);
    return null;
  }
}

function formatTimeSlot(isoString: string): string {
  const d = new Date(isoString);
  return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
}

function formatDateReadable(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
}

// ── Twilio helper ──

async function sendTwilioSms(to: string, from: string, body: string) {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;

  if (!accountSid || !authToken) {
    throw new Error('Twilio credentials not configured');
  }

  const url = `${TWILIO_API_BASE}/Accounts/${accountSid}/Messages.json`;
  const auth = Buffer.from(`${accountSid}:${authToken}`).toString('base64');

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({ To: to, From: from, Body: body }).toString(),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || `Twilio API error: ${response.status}`);
  }
  return data;
}

// ── Look up agent owner ──

async function getAgentOwner(agentId: string): Promise<string | null> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('agents')
    .select('user_id')
    .filter('api_keys->>retell_agent_id', 'eq', agentId)
    .single();

  if (error || !data) {
    console.error('[agent-tools] Could not find agent owner for', agentId, error);
    return null;
  }
  return data.user_id;
}

// ── Tool: lookup_caller ──

async function handleLookupCaller(
  args: any,
  userId: string | null
): Promise<string> {
  const { phone_number } = args;
  if (!phone_number) return 'NEW CALLER: No phone number provided.\nProceed with standard greeting and qualification.';

  if (!userId) {
    console.error('[agent-tools] lookup_caller: no userId found for agent');
    return 'NEW CALLER: Could not look up caller (no agent owner).\nProceed with standard greeting and qualification.';
  }

  const supabase = getSupabase();

  try {
    // Normalize phone: strip spaces/dashes for flexible matching
    const normalizedPhone = phone_number.replace(/[\s\-()]/g, '');

    // 1. Query leads table for this caller
    const { data: leads, error: leadErr } = await supabase
      .from('leads')
      .select('first_name, last_name, email, source, status, created_at, raw_data')
      .eq('user_id', userId)
      .or(`phone.eq.${normalizedPhone},phone.eq.${phone_number}`)
      .order('created_at', { ascending: false })
      .limit(5);

    if (leadErr) {
      console.error('[agent-tools] lookup_caller leads query error:', leadErr);
    }

    // 2. Query appointments table for this caller
    const { data: appointments, error: apptErr } = await supabase
      .from('appointments')
      .select('service_name, starts_at, status, client_name, client_email, timezone')
      .eq('user_id', userId)
      .or(`client_phone.eq.${normalizedPhone},client_phone.eq.${phone_number}`)
      .order('starts_at', { ascending: false })
      .limit(10);

    if (apptErr) {
      console.error('[agent-tools] lookup_caller appointments query error:', apptErr);
    }

    // 3. Build response
    const hasLeads = leads && leads.length > 0;
    const hasAppointments = appointments && appointments.length > 0;

    if (!hasLeads && !hasAppointments) {
      return 'NEW CALLER: No previous record found for this number.\nProceed with standard greeting and qualification.';
    }

    let result = '';

    if (hasLeads) {
      const lead = leads[0]; // Most recent lead record
      const fullName = [lead.first_name, lead.last_name].filter(Boolean).join(' ') || 'Unknown';
      const callCount = leads.length;
      const lastContact = lead.created_at
        ? new Date(lead.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
        : 'Unknown';

      result += `RETURNING CALLER: ${fullName}`;
      if (lead.email) result += ` (${lead.email})`;
      result += '\n';
      result += `- Previous interactions: ${callCount}\n`;
      result += `- Last contact: ${lastContact}\n`;
      result += `- Status: ${lead.status || 'unknown'}\n`;
      result += `- Source: ${lead.source || 'unknown'}\n`;
    }

    if (hasAppointments) {
      const now = new Date();

      const upcoming = appointments.filter(a =>
        a.starts_at && new Date(a.starts_at) > now && a.status !== 'cancelled'
      );
      const past = appointments.filter(a =>
        a.starts_at && new Date(a.starts_at) <= now
      );

      if (upcoming.length > 0) {
        result += '\nUpcoming appointments:\n';
        for (const appt of upcoming.slice(0, 3)) {
          const apptDate = new Date(appt.starts_at);
          const dateStr = apptDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
          const timeStr = apptDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
          result += `  - ${appt.service_name || 'Appointment'} on ${dateStr} at ${timeStr} (${appt.status})\n`;
        }
      }

      if (past.length > 0) {
        result += `\nPast appointments: ${past.length} on record\n`;
        const lastAppt = past[0];
        const lastDate = new Date(lastAppt.starts_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
        result += `  - Most recent: ${lastAppt.service_name || 'Appointment'} on ${lastDate} (${lastAppt.status})\n`;
      }
    }

    result += '\nGreet them warmly by name and reference their history.';
    return result;
  } catch (err) {
    console.error('[agent-tools] lookup_caller error:', err);
    return 'NEW CALLER: Lookup failed due to an error.\nProceed with standard greeting and qualification.';
  }
}

// ── Tool: check_availability ──

async function handleCheckAvailability(args: any, calApiKey: string): Promise<string> {
  const { date } = args;
  if (!date) return 'Please provide a date to check availability.';

  const eventTypeId = await getEventTypeId(calApiKey);
  if (!eventTypeId) return 'Could not determine event type. Appointment scheduling may not be configured.';

  try {
    const startTime = `${date}T00:00:00Z`;
    const endTime = `${date}T23:59:59Z`;

    const url = `${CAL_BASE_URL}/slots?apiKey=${calApiKey}&startTime=${encodeURIComponent(startTime)}&endTime=${encodeURIComponent(endTime)}&eventTypeId=${eventTypeId}`;
    const response = await fetch(url);

    if (!response.ok) {
      const errText = await response.text();
      console.error('[agent-tools] Cal.com slots error:', response.status, errText);
      return 'Sorry, I could not check availability right now. Please try again.';
    }

    const data = await response.json();
    const slots = data.data?.slots || data.slots || {};

    // Cal.com returns slots grouped by date
    const dateSlots = slots[date] || [];

    if (dateSlots.length === 0) {
      return `There are no available time slots on ${formatDateReadable(date)}. Would you like to check another date?`;
    }

    const formattedSlots = dateSlots
      .slice(0, 8)
      .map((slot: any) => formatTimeSlot(slot.time || slot.start || slot))
      .join(', ');

    const moreText = dateSlots.length > 8 ? ` and ${dateSlots.length - 8} more` : '';
    return `Available times on ${formatDateReadable(date)}: ${formattedSlots}${moreText}. Which time works best for you?`;
  } catch (err) {
    console.error('[agent-tools] check_availability error:', err);
    return 'Sorry, I had trouble checking availability. Please try again.';
  }
}

// ── Tool: book_appointment ──

async function handleBookAppointment(
  args: any,
  calApiKey: string,
  userId: string | null,
  callId: string
): Promise<string> {
  const { name, email, phone, date, time, service, notes } = args;

  if (!name || !date || !time) {
    return 'I need at least your name, preferred date, and time to book an appointment.';
  }

  const eventTypeId = await getEventTypeId(calApiKey);
  if (!eventTypeId) return 'Appointment scheduling is not configured. I will note your request and have someone follow up.';

  try {
    // Build ISO start time
    const startISO = `${date}T${time}:00Z`;
    const endDate = new Date(startISO);
    endDate.setMinutes(endDate.getMinutes() + 20); // Default 20-min consultation
    const endISO = endDate.toISOString();

    // Cal.com V1 booking format
    const bookingBody: any = {
      eventTypeId,
      start: startISO,
      end: endISO,
      responses: {
        name: name,
        email: email || 'noemail@placeholder.com',
        location: { value: 'integrations:daily', optionValue: '' },
      },
      metadata: {
        source: 'ai_receptionist',
        call_id: callId,
        phone: phone || '',
        service: service || '',
        notes: notes || '',
      },
      timeZone: 'Europe/London',
      language: 'en',
    };

    const response = await fetch(`${CAL_BASE_URL}/bookings?apiKey=${calApiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bookingBody),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('[agent-tools] Cal.com booking error:', response.status, errText);
      return `I wasn't able to book that time slot. It may no longer be available. Would you like to try a different time?`;
    }

    const bookingData = await response.json();
    const booking = bookingData.data || bookingData;
    const bookingId = booking.id || booking.uid || 'N/A';

    // Insert into Supabase if we have a user
    if (userId) {
      const supabase = getSupabase();

      // Insert appointment record
      try {
        await supabase.from('appointments').insert({
          user_id: userId,
          cal_booking_id: String(bookingId),
          cal_event_type: service || 'Appointment',
          client_name: name,
          client_email: email || '',
          client_phone: phone || '',
          service_name: service || 'Appointment',
          starts_at: startISO,
          timezone: 'America/New_York',
          status: 'confirmed',
          raw_webhook: { source: 'agent_tool', call_id: callId, booking: bookingData },
        });
      } catch (dbErr) {
        console.error('[agent-tools] Failed to insert appointment:', dbErr);
      }

      // Insert lead record
      try {
        await supabase.from('leads').insert({
          first_name: name.split(' ')[0] || name,
          last_name: name.split(' ').slice(1).join(' ') || null,
          email: email || null,
          phone: phone || null,
          source: 'ai_receptionist',
          status: 'booked',
          user_id: userId,
          raw_data: { call_id: callId, service, booking_id: bookingId },
        });
      } catch (dbErr) {
        console.error('[agent-tools] Failed to insert lead:', dbErr);
      }

      // Deduct tokens (2 for booking)
      try {
        await deductTokens(
          userId,
          TOKEN_COSTS.lead_processed,
          'lead_processed',
          `Appointment booked via AI call: ${name} on ${date} at ${time}`,
          { call_id: callId, booking_id: bookingId, service }
        );
      } catch (tokenErr) {
        console.error('[agent-tools] Token deduction failed (non-blocking):', tokenErr);
      }
    }

    // Format confirmation
    const formattedDate = formatDateReadable(date);
    const formattedTime = formatTimeSlot(`${date}T${time}:00Z`);
    const refText = bookingId !== 'N/A' ? ` Your reference number is ${bookingId}.` : '';

    await notifyInfo(`📅 *New Appointment Booked via AI*\n\n👤 ${name}\n📧 ${email || 'N/A'}\n📱 ${phone || 'N/A'}\n📅 ${formattedDate} at ${formattedTime}\n💼 ${service || 'General'}\n📞 Call: ${callId}${refText}`);

    return `Great! Your appointment is confirmed for ${formattedDate} at ${formattedTime}.${refText} Is there anything else I can help you with?`;
  } catch (err) {
    console.error('[agent-tools] book_appointment error:', err);
    return 'Sorry, I had trouble booking your appointment. Let me note your request and have someone follow up with you.';
  }
}

// ── Tool: send_sms ──

async function handleSendSms(
  args: any,
  userId: string | null,
  callId: string
): Promise<string> {
  const { phone_number, message } = args;

  if (!phone_number || !message) {
    return 'I need a phone number and message to send a text.';
  }

  try {
    // Determine from number
    let fromNumber = process.env.TWILIO_FROM_NUMBER || '';

    // Try to get the user's Twilio number from Supabase
    if (userId && !fromNumber) {
      const supabase = getSupabase();
      const { data: phoneRow } = await supabase
        .from('phone_numbers')
        .select('phone_number')
        .eq('user_id', userId)
        .eq('status', 'active')
        .limit(1)
        .single();

      if (phoneRow) {
        fromNumber = phoneRow.phone_number;
      }
    }

    if (!fromNumber) {
      return 'SMS sending is not configured. Please contact the business directly.';
    }

    const result = await sendTwilioSms(phone_number, fromNumber, message);

    // Deduct tokens (5 for SMS)
    if (userId) {
      try {
        await deductTokens(
          userId,
          TOKEN_COSTS.sms_sent,
          'sms_sent',
          `SMS sent during AI call to ${phone_number}`,
          { call_id: callId, message_sid: result.sid, to: phone_number }
        );
      } catch (tokenErr) {
        console.error('[agent-tools] SMS token deduction failed (non-blocking):', tokenErr);
      }
    }

    return 'Text message sent successfully.';
  } catch (err) {
    console.error('[agent-tools] send_sms error:', err);
    return 'Sorry, I was unable to send the text message right now.';
  }
}

// ── Main handler ──

export const handler: Handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  try {
    const body = JSON.parse(event.body || '{}');
    const { call_id, agent_id, tool_call_id, name, arguments: toolArgs } = body;

    console.log(`[agent-tools] Tool call: ${name}, call_id=${call_id}, agent_id=${agent_id}`);

    if (!name) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing tool name' }),
      };
    }

    // Look up agent owner for Supabase operations
    const userId = agent_id ? await getAgentOwner(agent_id) : null;

    // Get Cal.com API key — in the future this could be per-user from Supabase
    const calApiKey = CAL_API_KEY;

    let content: string;

    switch (name) {
      case 'lookup_caller':
        content = await handleLookupCaller(toolArgs || {}, userId);
        break;

      case 'check_availability':
        content = await handleCheckAvailability(toolArgs || {}, calApiKey);
        break;

      case 'book_appointment':
        content = await handleBookAppointment(toolArgs || {}, calApiKey, userId, call_id || '');
        break;

      case 'send_sms':
        content = await handleSendSms(toolArgs || {}, userId, call_id || '');
        break;

      default:
        content = `Unknown tool: ${name}`;
        console.error(`[agent-tools] Unknown tool called: ${name}`);
    }

    // Retell expects { tool_call_id, content } in the response
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        tool_call_id: tool_call_id || '',
        content,
      }),
    };
  } catch (err) {
    console.error('[agent-tools] Unhandled error:', err);
    await notifyError('agent-tools: Unhandled exception', err);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        tool_call_id: '',
        content: 'Sorry, an error occurred while processing your request.',
      }),
    };
  }
};
