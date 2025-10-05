import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { code, error, state } = req.query;
    const appUrl = process.env.APP_URL || 'http://localhost:3000';

    if (error) {
      return res.redirect(`${appUrl}/dashboard/instant-lead-reply?fb=error`);
    }

    if (!code) {
      return res.redirect(`${appUrl}/dashboard/instant-lead-reply?fb=missing_code`);
    }

    // 1) Exchange code for short-lived user access token
    const tokenRes = await fetch(
      `https://graph.facebook.com/v20.0/oauth/access_token` +
        `?client_id=${process.env.FB_APP_ID}` +
        `&redirect_uri=${encodeURIComponent(`${appUrl}/api/auth/facebook/callback`)}` +
        `&client_secret=${process.env.FB_APP_SECRET}` +
        `&code=${code}`
    );
    
    const tokenData = await tokenRes.json();
    if (!tokenRes.ok) {
      console.error('Token exchange failed:', tokenData);
      return res.redirect(`${appUrl}/dashboard/instant-lead-reply?fb=token_fail`);
    }

    const userAccessToken = tokenData.access_token as string;

    // 2) Get list of Pages the user manages (and their page access tokens)
    const pagesRes = await fetch(
      `https://graph.facebook.com/v20.0/me/accounts?access_token=${userAccessToken}`
    );
    const pagesData = await pagesRes.json();
    if (!pagesRes.ok) {
      console.error('Pages fetch failed:', pagesData);
      return res.redirect(`${appUrl}/dashboard/instant-lead-reply?fb=pages_fail`);
    }

    // pagesData.data is an array: [{id, name, access_token, ...}]
    // Let the user choose pages in your UI, OR auto-connect the first one for a quick POC.
    const firstPage = pagesData.data?.[0];
    if (!firstPage) {
      return res.redirect(`${appUrl}/dashboard/instant-lead-reply?fb=no_pages`);
    }

    const pageId = firstPage.id;
    const pageAccessToken = firstPage.access_token;

    // 3) Store tokens per workspace (encrypt at rest in production)
    // Assume you know the workspace/user from session cookie/JWT
    const workspaceId = "YOUR_WORKSPACE_ID"; // replace with real lookup from session/auth
    await supabase.from("facebook_page_connections").upsert({
      workspace_id: workspaceId,
      page_id: pageId,
      page_name: firstPage.name,
      page_access_token: pageAccessToken,
    }, { onConflict: "workspace_id,page_id" });

    // 4) Subscribe the Page to your app's webhooks (leadgen)
    const subRes = await fetch(
      `https://graph.facebook.com/v20.0/${pageId}/subscribed_apps` +
        `?subscribed_fields=leadgen&access_token=${pageAccessToken}`,
      { method: "POST" }
    );
    const subData = await subRes.json();
    if (!subRes.ok) {
      console.error("Subscribe error:", subData);
      return res.redirect(`${appUrl}/dashboard/instant-lead-reply?fb=subscribe_fail`);
    }

    // Done — redirect back to your Instant Lead Reply page
    return res.redirect(`${appUrl}/dashboard/instant-lead-reply?fb=success`);
  } catch (error) {
    console.error('Facebook OAuth callback error:', error);
    return res.redirect(`${appUrl}/dashboard/instant-lead-reply?fb=error`);
  }
}
