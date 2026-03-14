import { Handler } from '@netlify/functions';
import Retell from 'retell-sdk';

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Content-Type': 'application/json',
};

export const handler: Handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  const apiKey = process.env.RETELL_API_KEY;
  if (!apiKey) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Retell API key not configured' }),
    };
  }

  const client = new Retell({ apiKey });

  try {
    // GET /retell-calls?call_id=xxx — get single call details
    if (event.httpMethod === 'GET') {
      const callId = event.queryStringParameters?.call_id;
      if (callId) {
        const call = await client.call.retrieve(callId);
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify(call),
        };
      }

      // GET /retell-calls — list recent calls (no body needed)
      const calls = await client.call.list({
        sort_order: 'descending',
        limit: 50,
      });
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(calls),
      };
    }

    // POST /retell-calls — list calls with filters
    if (event.httpMethod === 'POST') {
      const body = JSON.parse(event.body || '{}');

      const filterCriteria: Record<string, any> = {};

      if (body.agent_ids?.length) {
        filterCriteria.agent_id = body.agent_ids;
      }
      if (body.call_status?.length) {
        filterCriteria.call_status = body.call_status;
      }
      if (body.direction?.length) {
        filterCriteria.direction = body.direction;
      }
      if (body.start_date || body.end_date) {
        filterCriteria.start_timestamp = {};
        if (body.start_date) {
          filterCriteria.start_timestamp.lower_threshold = new Date(body.start_date).getTime();
        }
        if (body.end_date) {
          filterCriteria.start_timestamp.upper_threshold = new Date(body.end_date).getTime();
        }
      }

      const calls = await client.call.list({
        filter_criteria: Object.keys(filterCriteria).length ? filterCriteria : undefined,
        sort_order: body.sort_order || 'descending',
        limit: body.limit || 50,
        pagination_key: body.pagination_key,
      });

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(calls),
      };
    }

    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  } catch (error) {
    console.error('retell-calls error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Failed to fetch calls',
        details: error instanceof Error ? error.message : 'Unknown error',
      }),
    };
  }
};
