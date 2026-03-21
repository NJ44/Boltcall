import { Handler } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';
import { notifyError } from './_shared/notify';

/**
 * Retell Post-Call Webhook
 *
 * Receives Retell's post-call webhook events after every call ends.
 * Detects missed calls and triggers the text-back pipeline:
 *   1. Creates a lead with source='missed_call'
 *   2. Inserts a scheduled_message for SMS text-back
 *   3. The existing message-dispatcher cron picks it up and sends via Twilio
 *
 * Missed call criteria:
 *   - call_status === 'not_connected'
 *   - call_status === 'error'
 *   - call_status === 'ended' AND duration_ms < 15000 (abandoned)
 */

const MISSED_CALL_THRESHOLD_MS = 15000;

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
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

function isMissedCall(call: any): boolean {
  if (call.call_status === 'not_connected') return true;
  if (call.call_status === 'error') return true;
  if (
    call.call_status === 'ended' &&
    typeof call.duration_ms === 'number' &&
    call.duration_ms < MISSED_CALL_THRESHOLD_MS
  ) {
    return true;
  }
  return false;
}

function substituteTemplate(
  template: string,
  vars: Record<string, string>
): string {
  let result = template;
  for (const [key, value] of Object.entries(vars)) {
    result = result.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), value);
  }
  return result;
}

export const handler: Handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const payload = JSON.parse(event.body || '{}');

    // Retell sends { event: "call_ended", call: { ... } }
    // Some Retell versions send the call object directly
    const call = payload.call || payload;

    if (!call.call_id) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'No call_id in payload' }),
      };
    }

    // Only process inbound calls for missed call text-back
    const callerPhone = call.from_number;
    const agentId = call.agent_id;

    if (!agentId) {
      console.log('[retell-webhook] No agent_id, skipping');
      return { statusCode: 200, headers, body: JSON.stringify({ ok: true, skipped: true }) };
    }

    // Check if this is a missed call
    if (!isMissedCall(call)) {
      console.log(`[retell-webhook] Call ${call.call_id} is not a missed call (status=${call.call_status}, duration=${call.duration_ms}ms)`);
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ ok: true, missed: false }),
      };
    }

    console.log(`[retell-webhook] Missed call detected: ${call.call_id}, from=${callerPhone}, status=${call.call_status}, duration=${call.duration_ms}ms`);

    if (!callerPhone) {
      console.log('[retell-webhook] No caller phone number, skipping text-back');
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ ok: true, missed: true, textback: false, reason: 'no_caller_phone' }),
      };
    }

    const supabase = getSupabase();

    // Step 1: Look up agent owner (retell_agent_id is stored inside api_keys JSONB)
    const { data: agentRow, error: agentError } = await supabase
      .from('agents')
      .select('user_id')
      .filter('api_keys->>retell_agent_id', 'eq', agentId)
      .single();

    if (agentError || !agentRow) {
      console.error('[retell-webhook] Could not find agent owner for', agentId, agentError);
      await notifyError('retell-webhook: Agent owner not found (missed call)', agentError || 'No matching agent row', {
        agentId, callerPhone: callerPhone || 'unknown', callId: call.call_id, callStatus: call.call_status,
      });
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ ok: true, missed: true, textback: false, reason: 'agent_not_found' }),
      };
    }

    const userId = agentRow.user_id;

    // Step 2: Check missed call config
    const { data: featureRow } = await supabase
      .from('business_features')
      .select('missed_call_config')
      .eq('user_id', userId)
      .single();

    const config = (featureRow?.missed_call_config || {}) as Record<string, any>;

    // Step 3: Always create a lead for missed calls (even if text-back is disabled)
    const { data: lead, error: leadError } = await supabase
      .from('leads')
      .insert({
        first_name: null,
        last_name: null,
        phone: callerPhone,
        source: 'missed_call',
        status: 'pending',
        user_id: userId,
        raw_data: call,
      })
      .select('id')
      .single();

    if (leadError) {
      console.error('[retell-webhook] Failed to create lead:', leadError);
      await notifyError('retell-webhook: Lead creation failed', leadError, {
        callerPhone, userId, callId: call.call_id, callStatus: call.call_status,
      });
    }

    // Auto-enroll in missed_call follow-up sequences
    if (lead?.id) {
      try {
        const { data: sequences } = await supabase
          .from('followup_sequences')
          .select('id')
          .eq('user_id', userId)
          .eq('trigger_event', 'missed_call')
          .eq('is_active', true);

        if (sequences && sequences.length > 0) {
          for (const seq of sequences) {
            // Get the first step's delay to calculate next_step_at
            const { data: firstStep } = await supabase
              .from('followup_sequence_steps')
              .select('delay_minutes')
              .eq('sequence_id', seq.id)
              .eq('step_order', 1)
              .eq('is_active', true)
              .single();

            const delayMs = (firstStep?.delay_minutes || 1440) * 60 * 1000;

            await supabase.from('followup_enrollments').insert({
              sequence_id: seq.id,
              user_id: userId,
              lead_id: lead.id,
              contact_name: null,
              contact_phone: callerPhone,
              contact_email: null,
              current_step: 0,
              status: 'active',
              next_step_at: new Date(Date.now() + delayMs).toISOString(),
            });
          }
          console.log(`[retell-webhook] Auto-enrolled ${callerPhone} in ${sequences.length} missed_call sequence(s)`);
        }
      } catch (enrollErr) {
        console.error('[retell-webhook] Auto-enrollment failed (non-blocking):', enrollErr);
      }
    }

    if (!config.enabled) {
      console.log('[retell-webhook] Missed call text-back not enabled for user', userId);
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ ok: true, missed: true, lead_created: !!lead, textback: false, reason: 'not_enabled' }),
      };
    }

    // Step 4: Get business name for template substitution
    const { data: profileRow } = await supabase
      .from('business_profiles')
      .select('business_name, phone')
      .eq('user_id', userId)
      .single();

    const businessName = profileRow?.business_name || 'our business';
    const businessPhone = profileRow?.phone || '';

    // Step 5: Build the SMS message
    const defaultTemplate =
      "Hi! We noticed we missed your call at {{business_name}}. How can we help? Reply to this text or call us back. We're here for you!";
    const template = config.template || defaultTemplate;

    const messageBody = substituteTemplate(template, {
      business_name: businessName,
      business_phone: businessPhone,
    });

    // Step 6: Calculate scheduled time based on delay config
    const delayMinutes = config.delay_minutes ?? 0;
    const scheduledFor = new Date(Date.now() + delayMinutes * 60 * 1000).toISOString();

    // Step 7: Insert scheduled message
    const { error: msgError } = await supabase.from('scheduled_messages').insert({
      type: 'missed_call_textback',
      channel: 'sms',
      recipient_phone: callerPhone,
      message_body: messageBody,
      scheduled_for: scheduledFor,
      status: 'scheduled',
      user_id: userId,
      metadata: {
        call_id: call.call_id,
        call_status: call.call_status,
        duration_ms: call.duration_ms,
        lead_id: lead?.id || null,
      },
    });

    if (msgError) {
      console.error('[retell-webhook] Failed to schedule text-back:', msgError);
      await notifyError('retell-webhook: Text-back scheduling failed', msgError, {
        callerPhone, userId, callId: call.call_id, delayMinutes,
      });
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          ok: true,
          missed: true,
          textback: false,
          reason: 'schedule_failed',
          lead_created: !!lead,
        }),
      };
    }

    console.log(`[retell-webhook] Text-back scheduled for ${callerPhone} at ${scheduledFor}`);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        ok: true,
        missed: true,
        textback: true,
        lead_created: !!lead,
        lead_id: lead?.id || null,
        scheduled_for: scheduledFor,
      }),
    };
  } catch (err) {
    console.error('[retell-webhook] Error:', err);
    await notifyError('retell-webhook: Unhandled exception', err);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Call webhook processing failed. Our team has been notified.',
      }),
    };
  }
};
