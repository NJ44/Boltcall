import { Handler } from '@netlify/functions';
import Retell from 'retell-sdk';

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
  const agentId = process.env.CHALLENGE_AGENT_ID;
  const secretWord = process.env.CHALLENGE_SECRET_WORD || 'boltcall';

  if (!retellApiKey) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'Retell API key not configured' }) };
  }
  if (!agentId) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'CHALLENGE_AGENT_ID env var not set — create the agent first via create-challenge-agent' }) };
  }

  const client = new Retell({ apiKey: retellApiKey });

  try {
    const body = JSON.parse(event.body || '{}');
    const { name, email } = body;

    const webCall = await (client.call as any).createWebCall({
      agent_id: agentId,
      retell_llm_dynamic_variables: {
        secret_word: secretWord,
      },
      metadata: {
        name: name || '',
        email: email || '',
        source: 'break-our-ai-challenge',
      },
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        access_token: webCall.access_token,
        call_id: webCall.call_id,
      }),
    };
  } catch (err: any) {
    console.error('Failed to create challenge web call:', err);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: err.message || 'Failed to create call' }),
    };
  }
};

export { handler };
