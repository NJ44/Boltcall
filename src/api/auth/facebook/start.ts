import crypto from 'crypto';

export default async function handler(req: Request) {
  if (req.method !== 'GET') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
  }

  try {
    const clientId = process.env.VITE_FB_APP_ID;
    const appUrl = process.env.VITE_APP_URL || 'http://localhost:5173';
    const redirectUri = encodeURIComponent(`${appUrl}/api/auth/facebook/callback`);
    const state = crypto.randomBytes(16).toString('hex'); // store in session if you have one
    
    const scopes = [
      "pages_manage_metadata",
      "pages_read_engagement", 
      "leads_retrieval",
      "pages_show_list",    // to list pages during selection
      "public_profile"
    ].join(",");

    if (!clientId) {
      return new Response(JSON.stringify({ error: 'Facebook App ID not configured' }), { status: 500 });
    }

    const url = `https://www.facebook.com/v20.0/dialog/oauth?client_id=${clientId}&redirect_uri=${redirectUri}&state=${state}&scope=${scopes}`;

    return new Response(JSON.stringify({ url }), { status: 200 });
  } catch (error) {
    console.error('Error generating Facebook OAuth URL:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
  }
}
