import { Handler } from '@netlify/functions';

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json',
};

const EMAIL_RX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const handler: Handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers, body: '' };
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  const apiKey = process.env.BREVO_API_KEY;
  const listIdRaw = process.env.BREVO_LIST_ID;

  if (!apiKey || !listIdRaw) {
    console.error('brevo-subscribe: missing BREVO_API_KEY or BREVO_LIST_ID');
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'Server not configured' }) };
  }

  const listId = parseInt(listIdRaw, 10);
  if (Number.isNaN(listId)) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'Invalid list id' }) };
  }

  let email = '';
  let firstName: string | undefined;
  try {
    const body = JSON.parse(event.body || '{}');
    email = String(body.email || '').trim().toLowerCase();
    if (body.firstName) firstName = String(body.firstName).trim();
  } catch {
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'Invalid JSON' }) };
  }

  if (!email || !EMAIL_RX.test(email)) {
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'Valid email required' }) };
  }

  const payload: Record<string, unknown> = {
    email,
    listIds: [listId],
    updateEnabled: true,
  };
  if (firstName) payload.attributes = { FIRSTNAME: firstName };

  try {
    const res = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        'api-key': apiKey,
      },
      body: JSON.stringify(payload),
    });

    if (res.ok || res.status === 204) {
      return { statusCode: 200, headers, body: JSON.stringify({ ok: true }) };
    }

    const text = await res.text();
    let parsed: { code?: string } | null = null;
    try { parsed = JSON.parse(text); } catch {}
    if (parsed?.code === 'duplicate_parameter') {
      return { statusCode: 200, headers, body: JSON.stringify({ ok: true, alreadySubscribed: true }) };
    }

    console.error('Brevo error:', res.status, text);
    return { statusCode: 502, headers, body: JSON.stringify({ error: 'Subscription failed' }) };
  } catch (err: unknown) {
    console.error('brevo-subscribe error:', err);
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'Something went wrong' }) };
  }
};

export { handler };
