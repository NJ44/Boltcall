import { Handler } from '@netlify/functions';
import { deductTokens, deductTokensBatch, TOKEN_COSTS } from './_shared/token-utils';

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json',
};

const TWILIO_API_BASE = 'https://api.twilio.com/2010-04-01';

async function twilioRequest(path: string, method: string, body?: Record<string, string>) {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;

  if (!accountSid || !authToken) {
    throw new Error('Twilio credentials not configured');
  }

  const url = `${TWILIO_API_BASE}/Accounts/${accountSid}${path}`;
  const auth = Buffer.from(`${accountSid}:${authToken}`).toString('base64');

  const options: RequestInit = {
    method,
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  };

  if (body) {
    options.body = new URLSearchParams(body).toString();
  }

  const response = await fetch(url, options);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || `Twilio API error: ${response.status}`);
  }

  return data;
}

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

    // Send a single SMS
    if (action === 'send') {
      const { to, from, message } = body;
      if (!to || !message) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'to and message are required' }),
        };
      }

      // Use provided from number or fall back to first purchased number
      const fromNumber = from || process.env.TWILIO_FROM_NUMBER;
      if (!fromNumber) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'from number required. Set TWILIO_FROM_NUMBER env var or pass from in body' }),
        };
      }

      const result = await twilioRequest('/Messages.json', 'POST', {
        To: to,
        From: fromNumber,
        Body: message,
      });

      // Deduct tokens for SMS sent (user_id is optional — skip if not provided)
      if (body.user_id) {
        try {
          await deductTokens(
            body.user_id,
            TOKEN_COSTS.sms_sent,
            'sms_sent',
            `SMS to ${to}`,
            { message_sid: result.sid, to, from: fromNumber }
          );
        } catch (tokenErr) {
          console.error('SMS token deduction failed (non-blocking):', tokenErr);
        }
      }

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          message_sid: result.sid,
          status: result.status,
          to: result.to,
          from: result.from,
        }),
      };
    }

    // Send bulk SMS
    if (action === 'send_bulk') {
      const { messages } = body;
      if (!messages?.length) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'messages array required' }),
        };
      }

      const fromNumber = body.from || process.env.TWILIO_FROM_NUMBER;
      const results = await Promise.allSettled(
        messages.map((msg: { to: string; message: string }) =>
          twilioRequest('/Messages.json', 'POST', {
            To: msg.to,
            From: fromNumber,
            Body: msg.message,
          })
        )
      );

      const summary = results.map((result, i) => ({
        to: messages[i].to,
        success: result.status === 'fulfilled',
        message_sid: result.status === 'fulfilled' ? result.value.sid : undefined,
        error: result.status === 'rejected' ? result.reason.message : undefined,
      }));

      // Deduct tokens for all successfully sent SMS in batch
      if (body.user_id) {
        const successfulSms = summary.filter((s) => s.success);
        if (successfulSms.length > 0) {
          try {
            await deductTokensBatch(
              body.user_id,
              successfulSms.map((s) => ({
                cost: TOKEN_COSTS.sms_sent,
                category: 'sms_sent' as const,
                description: `SMS to ${s.to}`,
                metadata: { message_sid: s.message_sid, to: s.to, bulk: true },
              }))
            );
          } catch (tokenErr) {
            console.error('Bulk SMS token deduction failed (non-blocking):', tokenErr);
          }
        }
      }

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          sent: summary.filter(s => s.success).length,
          failed: summary.filter(s => !s.success).length,
          results: summary,
        }),
      };
    }

    // Get message history
    if (action === 'list') {
      const accountSid = process.env.TWILIO_ACCOUNT_SID;
      const authToken = process.env.TWILIO_AUTH_TOKEN;
      const auth = Buffer.from(`${accountSid}:${authToken}`).toString('base64');

      const params = new URLSearchParams({ PageSize: String(body.limit || 50) });
      if (body.to) params.set('To', body.to);
      if (body.from) params.set('From', body.from);
      if (body.date_sent) params.set('DateSent', body.date_sent);

      const url = `${TWILIO_API_BASE}/Accounts/${accountSid}/Messages.json?${params.toString()}`;
      const response = await fetch(url, {
        headers: { 'Authorization': `Basic ${auth}` },
      });
      const data = await response.json();

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          messages: data.messages || [],
          total: data.total || 0,
        }),
      };
    }

    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: 'Invalid action. Use: send, send_bulk, or list' }),
    };
  } catch (error) {
    console.error('twilio-sms error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Twilio SMS operation failed',
        details: error instanceof Error ? error.message : 'Unknown error',
      }),
    };
  }
};
