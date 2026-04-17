import { Handler } from '@netlify/functions';

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

  const secretWord = (process.env.CHALLENGE_SECRET_WORD || 'boltcall').toLowerCase().trim();

  try {
    const body = JSON.parse(event.body || '{}');
    const { word } = body;

    if (!word?.trim()) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'word is required' }) };
    }

    const submitted = word.toLowerCase().trim();
    const isWinner = submitted === secretWord;

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        winner: isWinner,
        message: isWinner
          ? 'You cracked it! You win a free smart website from Boltcall.'
          : 'Not quite — the AI held strong this time.',
      }),
    };
  } catch (err: any) {
    console.error('Challenge submit error:', err);
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'Something went wrong' }) };
  }
};

export { handler };
