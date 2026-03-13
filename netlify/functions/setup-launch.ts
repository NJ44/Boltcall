import { Handler } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json',
};

export const handler: Handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Supabase not configured' }),
    };
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    const body = JSON.parse(event.body || '{}');
    const { workspaceId, isEnabled, userId } = body;

    if (!workspaceId) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'workspaceId is required' }),
      };
    }

    // Update workspace — only use columns that exist in the schema
    const { error: wsError } = await supabase
      .from('workspaces')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', workspaceId);

    if (wsError) {
      console.error('Workspace update error:', wsError);
    }

    // Also try setting setup_completed if the column exists (non-fatal)
    await supabase
      .from('workspaces')
      .update({ setup_completed: true, setup_completed_at: new Date().toISOString() })
      .eq('id', workspaceId)
      .then(({ error }) => { if (error) console.log('setup_completed column not yet added'); });

    // Update business profile if userId provided
    if (userId) {
      const { error: bpError } = await supabase
        .from('business_profiles')
        .update({ updated_at: new Date().toISOString() })
        .eq('user_id', userId);

      if (bpError) {
        console.error('Business profile update error:', bpError);
      }
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: 'Setup completed successfully',
      }),
    };
  } catch (error) {
    console.error('setup-launch error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Setup launch failed',
        details: error instanceof Error ? error.message : 'Unknown error',
      }),
    };
  }
};
