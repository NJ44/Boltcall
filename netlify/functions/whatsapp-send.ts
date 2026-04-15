import { Handler } from '@netlify/functions';
import { getSupabase, deductTokens } from './_shared/token-utils';
import { notifyError } from './_shared/notify';

/**
 * WhatsApp Send — Sends an outbound WhatsApp message via Meta Cloud API.
 *
 * POST /.netlify/functions/whatsapp-send
 * Body: { userId, to, body, messageId? }
 */

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json',
};

const WA_SEND_TOKEN_COST = 6;

function buildThreadId(phone1: string, phone2: string): string {
  const sorted = [phone1, phone2].sort();
  return `${sorted[0]}_${sorted[1]}`;
}

export const handler: Handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: CORS_HEADERS, body: '' };
  }
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: CORS_HEADERS, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  let payload: any;
  try {
    payload = JSON.parse(event.body || '{}');
  } catch {
    return { statusCode: 400, headers: CORS_HEADERS, body: JSON.stringify({ error: 'Invalid JSON' }) };
  }

  const { userId, to, body: messageBody } = payload;
  if (!userId || !to || !messageBody) {
    return { statusCode: 400, headers: CORS_HEADERS, body: JSON.stringify({ error: 'userId, to, and body required' }) };
  }

  const supabase = getSupabase();

  try {
    // 1. Load WhatsApp settings
    const { data: settings, error: settingsErr } = await supabase
      .from('whatsapp_settings')
      .select('wa_phone_number_id, wa_access_token, is_enabled')
      .eq('user_id', userId)
      .maybeSingle();

    if (settingsErr || !settings) {
      return { statusCode: 400, headers: CORS_HEADERS, body: JSON.stringify({ error: 'WhatsApp settings not found' }) };
    }

    if (!settings.wa_phone_number_id || !settings.wa_access_token) {
      return { statusCode: 400, headers: CORS_HEADERS, body: JSON.stringify({ error: 'WhatsApp credentials not configured' }) };
    }

    // 2. POST to Meta Cloud API
    const metaUrl = `https://graph.facebook.com/v19.0/${settings.wa_phone_number_id}/messages`;
    const metaRes = await fetch(metaUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${settings.wa_access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to,
        type: 'text',
        text: { body: messageBody },
      }),
    });

    const metaData = await metaRes.json().catch(() => ({}));

    if (!metaRes.ok) {
      console.error('[whatsapp-send] Meta API error:', metaData);
      await notifyError('whatsapp-send: Meta API error', new Error(JSON.stringify(metaData)), { userId, to });
      return { statusCode: 502, headers: CORS_HEADERS, body: JSON.stringify({ error: 'Meta API error', detail: metaData }) };
    }

    const waMessageId = metaData?.messages?.[0]?.id || null;
    const fromNumber = settings.wa_phone_number_id;
    const threadId = buildThreadId(fromNumber, to);

    // 3. Store outbound message
    await supabase.from('whatsapp_conversations').insert({
      user_id: userId,
      direction: 'outbound',
      from_number: fromNumber,
      to_number: to,
      body: messageBody,
      wa_message_id: waMessageId,
      thread_id: threadId,
      status: 'sent',
    });

    // 4. Deduct 6 tokens (sms_sent category — WhatsApp is a messaging channel)
    await deductTokens(userId, WA_SEND_TOKEN_COST, 'sms_sent', 'WhatsApp message sent', {}, supabase);

    return {
      statusCode: 200,
      headers: CORS_HEADERS,
      body: JSON.stringify({ success: true, wa_message_id: waMessageId }),
    };
  } catch (error) {
    console.error('[whatsapp-send] Error:', error);
    await notifyError('whatsapp-send', error as Error, { userId, to });
    return {
      statusCode: 500,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};
