import { NextApiRequest, NextApiResponse } from 'next';
import crypto from 'crypto';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const clientId = process.env.FB_APP_ID;
    const appUrl = process.env.APP_URL || 'http://localhost:3000';
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
      return res.status(500).json({ error: 'Facebook App ID not configured' });
    }

    const url = `https://www.facebook.com/v20.0/dialog/oauth?client_id=${clientId}&redirect_uri=${redirectUri}&state=${state}&scope=${scopes}`;

    return res.status(200).json({ url });
  } catch (error) {
    console.error('Error generating Facebook OAuth URL:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
