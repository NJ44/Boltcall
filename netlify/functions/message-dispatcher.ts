import { Handler } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';
import { deductTokens, TOKEN_COSTS } from './_shared/token-utils';
import { notifyError } from './_shared/notify';

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || 'https://hbwogktdajorojljkjwg.supabase.co';
const TWILIO_API_BASE = 'https://api.twilio.com/2010-04-01';

function getServiceClient() {
  return createClient(SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY!);
}

async function sendTwilioSms(to: string, message: string): Promise<{ sid: string } | { error: string }> {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const fromNumber = process.env.TWILIO_FROM_NUMBER;

  if (!accountSid || !authToken || !fromNumber) {
    return { error: 'Twilio credentials not configured' };
  }

  const url = `${TWILIO_API_BASE}/Accounts/${accountSid}/Messages.json`;
  const auth = Buffer.from(`${accountSid}:${authToken}`).toString('base64');

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      To: to,
      From: fromNumber,
      Body: message,
    }).toString(),
  });

  const data = await response.json();

  if (!response.ok) {
    return { error: data.message || `Twilio API error: ${response.status}` };
  }

  return { sid: data.sid };
}

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  // Auth check — require secret header
  const dispatcherKey = process.env.DISPATCHER_SECRET;
  if (dispatcherKey) {
    const providedKey = event.headers['x-dispatcher-key'] || event.headers['X-Dispatcher-Key'];
    if (providedKey !== dispatcherKey) {
      return { statusCode: 401, body: JSON.stringify({ error: 'Unauthorized' }) };
    }
  }

  const supabase = getServiceClient();

  try {
    // Fetch due messages (batch of 50 to avoid timeouts)
    const { data: messages, error: fetchError } = await supabase
      .from('scheduled_messages')
      .select('*')
      .eq('status', 'scheduled')
      .lte('scheduled_for', new Date().toISOString())
      .order('scheduled_for', { ascending: true })
      .limit(50);

    if (fetchError) {
      console.error('[message-dispatcher] Failed to fetch messages:', fetchError);
      await notifyError('message-dispatcher: Failed to fetch due messages', fetchError);
      return { statusCode: 500, body: JSON.stringify({ error: 'Failed to fetch due messages' }) };
    }

    if (!messages || messages.length === 0) {
      return { statusCode: 200, body: JSON.stringify({ processed: 0, sent: 0, failed: 0 }) };
    }

    let sent = 0;
    let failed = 0;

    for (const msg of messages) {
      if (msg.channel === 'sms' && msg.recipient_phone) {
        const result = await sendTwilioSms(msg.recipient_phone, msg.message_body);

        if ('sid' in result) {
          // Success
          await supabase
            .from('scheduled_messages')
            .update({
              status: 'sent',
              sent_at: new Date().toISOString(),
              twilio_sid: result.sid,
              tokens_deducted: TOKEN_COSTS.sms_sent,
            })
            .eq('id', msg.id);

          // Deduct tokens
          try {
            await deductTokens(
              msg.user_id,
              TOKEN_COSTS.sms_sent,
              'sms_sent',
              `${msg.type === 'reminder' ? 'Reminder' : 'Review request'} SMS to ${msg.recipient_phone}`,
              { scheduled_message_id: msg.id, twilio_sid: result.sid, type: msg.type },
              supabase
            );
          } catch (tokenErr) {
            console.error('[message-dispatcher] Token deduction failed (non-blocking):', tokenErr);
          }

          sent++;
        } else {
          // Failure
          await supabase
            .from('scheduled_messages')
            .update({
              status: 'failed',
              error: result.error,
            })
            .eq('id', msg.id);

          await notifyError('message-dispatcher: SMS send failed', result.error, {
            messageId: msg.id,
            recipient: msg.recipient_phone,
            messageType: msg.type,
            userId: msg.user_id,
          });

          failed++;
        }
      } else {
        // Email channel or missing phone — mark as failed for now (email not implemented)
        await supabase
          .from('scheduled_messages')
          .update({
            status: 'failed',
            error: msg.channel === 'email' ? 'Email dispatch not yet implemented' : 'No recipient phone number',
          })
          .eq('id', msg.id);

        failed++;
      }
    }

    console.log(`[message-dispatcher] Processed: ${messages.length}, Sent: ${sent}, Failed: ${failed}`);

    return {
      statusCode: 200,
      body: JSON.stringify({ processed: messages.length, sent, failed }),
    };
  } catch (err: any) {
    console.error('[message-dispatcher] Error:', err);
    await notifyError('message-dispatcher: Unhandled exception', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Message dispatch failed. Our team has been notified.' }),
    };
  }
};
