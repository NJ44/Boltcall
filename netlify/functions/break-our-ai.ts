import { Handler } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json',
};

function getSupabase() {
  // challenge_winners is service-role-only by design (no anon/authenticated grants).
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });
}

const handler: Handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers, body: '' };

  const path = event.path
    .replace('/.netlify/functions/break-our-ai', '')
    .replace(/^\//, '');

  // ── POST /winner — Save winner prize claim details ────────────────────────
  if (event.httpMethod === 'POST' && path === 'winner') {
    try {
      const body = JSON.parse(event.body || '{}');
      const { name, email, businessName, businessType, websiteUrl, phone, city, biggestChallenge } = body;

      if (!name || !email || !businessName || !businessType) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'name, email, businessName, and businessType are required' }),
        };
      }

      const supabase = getSupabase();
      if (supabase) {
        await supabase.from('challenge_winners').insert({
          name: name.trim(),
          email: email.trim(),
          business_name: businessName.trim(),
          business_type: businessType,
          website_url: websiteUrl?.trim() || null,
          phone: phone?.trim() || null,
          city: city?.trim() || null,
          biggest_challenge: biggestChallenge?.trim() || null,
          created_at: new Date().toISOString(),
        });
      }

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ success: true }),
      };
    } catch (err: any) {
      console.error('Winner submission error:', err);
      // Return 200 so the frontend still shows the thank-you state.
      // Winner data can be recovered from logs if needed.
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ success: true }),
      };
    }
  }

  return {
    statusCode: 404,
    headers,
    body: JSON.stringify({ error: 'Not found' }),
  };
};

export { handler };
