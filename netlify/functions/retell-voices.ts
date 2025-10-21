import { Handler } from '@netlify/functions';
import Retell from 'retell-sdk';

export const handler: Handler = async (event, context) => {
  // Enable CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Content-Type': 'application/json',
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const apiKey = process.env.VITE_RETELL_API_KEY;
    
    if (!apiKey) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Retell API key not configured' }),
      };
    }

    // Create Retell client
    const client = new Retell({
      apiKey: apiKey,
    });

    // Get voices using SDK
    const voiceResponses = await client.voice.list();
    
    // Transform the response to match frontend expectations
    const voices = voiceResponses.map((voice: any) => ({
      id: voice.voice_id,
      name: voice.voice_name,
      accent: voice.accent,
      gender: voice.gender,
      preview: voice.preview_audio_url,
    }));

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(voices),
    };
  } catch (error) {
    console.error('Error fetching voices:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Failed to fetch voices',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
    };
  }
};
