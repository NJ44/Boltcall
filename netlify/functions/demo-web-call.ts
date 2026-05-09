import { Handler } from '@netlify/functions';
import Retell from 'retell-sdk';
import { createClient } from '@supabase/supabase-js';

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json',
};

const handler: Handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers, body: '' };
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  const retellApiKey = process.env.RETELL_API_KEY;
  const agentId = process.env.RETELL_DEMO_AGENT_ID;
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!retellApiKey) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'RETELL_API_KEY not configured' }) };
  }
  if (!agentId) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'RETELL_DEMO_AGENT_ID not configured — create the demo agent in Retell first' }) };
  }
  if (!supabaseUrl || !supabaseServiceKey) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'Supabase env vars not configured' }) };
  }

  let demo_id: string;
  try {
    const body = JSON.parse(event.body || '{}');
    demo_id = body.demo_id;
    if (!demo_id) throw new Error('missing demo_id');
  } catch {
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'demo_id required in request body' }) };
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  const { data: session, error: fetchError } = await supabase
    .from('demo_sessions')
    .select('*')
    .eq('id', demo_id)
    .single();

  if (fetchError || !session) {
    return { statusCode: 404, headers, body: JSON.stringify({ error: 'Demo session not found' }) };
  }

  const client = new Retell({ apiKey: retellApiKey });

  try {
    const webCall = await (client.call as any).createWebCall({
      agent_id: agentId,
      retell_llm_dynamic_variables: {
        business_name: session.business_name,
        niche: session.niche || 'local service business',
        location: session.location || '',
        services_list: session.services || 'our services',
      },
      metadata: {
        demo_id,
        prospect_name: session.prospect_name || '',
        source: 'facebook-dm-demo',
      },
    });

    // Record when the prospect clicked the link
    await supabase
      .from('demo_sessions')
      .update({ clicked_at: new Date().toISOString() })
      .eq('id', demo_id);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        access_token: webCall.access_token,
        call_id: webCall.call_id,
        business_name: session.business_name,
      }),
    };
  } catch (err: any) {
    console.error('Failed to create demo web call:', err);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: err.message || 'Failed to create call' }),
    };
  }
};

export { handler };
