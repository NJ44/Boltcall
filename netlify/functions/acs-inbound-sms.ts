import { Handler } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';
import { notifyError } from './_shared/notify';

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || 'https://hbwogktdajorojljkjwg.supabase.co';

function getServiceClient() {
  return createClient(SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY!, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

function buildThreadId(phone1: string, phone2: string): string {
  return [phone1, phone2].sort().join('_');
}

/**
 * ACS Inbound SMS Webhook (Azure Event Grid)
 *
 * Replaces twilio-inbound-sms.ts for ACS.
 * Configure this URL as the Event Grid webhook endpoint for the
 * Microsoft.Communication.SMSReceived event on your ACS resource.
 *
 * Handles:
 *   - Microsoft.EventGrid.SubscriptionValidationEvent  (required handshake)
 *   - Microsoft.Communication.SMSReceived              (inbound SMS)
 */
export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method not allowed' };
  }

  let events: any[];
  try {
    events = JSON.parse(event.body || '[]');
    if (!Array.isArray(events)) events = [events];
  } catch {
    return { statusCode: 400, body: 'Invalid JSON' };
  }

  // ── Event Grid validation handshake (one-time, during webhook registration) ──
  const validationEvent = events.find(
    (e: any) => e.eventType === 'Microsoft.EventGrid.SubscriptionValidationEvent'
  );
  if (validationEvent) {
    const validationCode = validationEvent.data?.validationCode;
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ validationResponse: validationCode }),
    };
  }

  const supabase = getServiceClient();

  for (const evt of events) {
    if (evt.eventType !== 'Microsoft.Communication.SMSReceived') continue;

    const d = evt.data || {};
    const from: string = d.from || '';
    const to: string = d.to || '';
    const body: string = d.message || '';
    const messageId: string = d.messageId || evt.id || '';

    if (!from || !body) continue;

    console.log(`[acs-inbound-sms] From: ${from}, To: ${to}, Body: ${body.slice(0, 100)}`);

    try {
      // Look up which user owns the receiving phone number
      const { data: phoneRow } = await supabase
        .from('phone_numbers')
        .select('user_id, workspace_id')
        .eq('phone_number', to)
        .single();

      const userId = phoneRow?.user_id || null;
      const workspaceId = phoneRow?.workspace_id || null;
      const threadId = buildThreadId(from, to);

      // Store the inbound message (reuse existing sms_conversations table)
      const { data: insertedMsg, error: insertError } = await supabase
        .from('sms_conversations')
        .insert({
          user_id: userId,
          workspace_id: workspaceId,
          direction: 'inbound',
          from_number: from,
          to_number: to,
          body,
          twilio_sid: messageId, // column stores ACS messageId for compat
          status: 'received',
          thread_id: threadId,
        })
        .select('id')
        .single();

      if (insertError) {
        console.error('[acs-inbound-sms] Insert failed:', insertError);
        await notifyError('acs-inbound-sms: Insert failed', insertError, { from, to });
        continue;
      }

      // Appointment confirm/cancel keyword detection
      const lower = body.toLowerCase().trim();
      const isCancel = /^(no|cancel|n|stop|2)$/i.test(lower);

      if (userId && isCancel) {
        const { data: appt } = await supabase
          .from('appointments')
          .select('id, status')
          .eq('user_id', userId)
          .eq('client_phone', from)
          .eq('status', 'confirmed')
          .order('starts_at', { ascending: true })
          .limit(1)
          .single();

        if (appt) {
          await supabase
            .from('appointments')
            .update({ status: 'cancelled', updated_at: new Date().toISOString() })
            .eq('id', appt.id);

          await supabase
            .from('scheduled_messages')
            .update({ status: 'cancelled' })
            .eq('appointment_id', appt.id)
            .eq('status', 'scheduled');
        }
      }

      // Trigger AI auto-reply (fire-and-forget)
      if (userId && insertedMsg?.id) {
        const { data: smsSettings } = await supabase
          .from('sms_settings')
          .select('is_enabled')
          .eq('user_id', userId)
          .maybeSingle();

        if (smsSettings?.is_enabled !== false) {
          const siteUrl = process.env.URL || process.env.DEPLOY_URL || '';
          if (siteUrl) {
            fetch(`${siteUrl}/.netlify/functions/sms-ai-responder`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ messageId: insertedMsg.id, userId, action: 'generate' }),
            }).catch(err => {
              console.error('[acs-inbound-sms] Failed to trigger AI responder:', err);
            });
          }
        }
      }
    } catch (err: any) {
      console.error('[acs-inbound-sms] Error processing event:', err);
      await notifyError('acs-inbound-sms: Event processing failed', err, { from, to });
    }
  }

  return { statusCode: 200, body: '' };
};
