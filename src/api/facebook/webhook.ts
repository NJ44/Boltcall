const VERIFY_TOKEN = process.env.VITE_FB_WEBHOOK_VERIFY_TOKEN!;

export default async function handler(req: Request) {
  if (req.method === 'GET') {
    // Webhook verification
    const url = new URL(req.url);
    const mode = url.searchParams.get('hub.mode');
    const token = url.searchParams.get('hub.verify_token');
    const challenge = url.searchParams.get('hub.challenge');

    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      return new Response(challenge, { status: 200 });
    }
    return new Response('Forbidden', { status: 403 });
  }

  if (req.method === 'POST') {
    // Webhook event handling
    try {
      const body = await req.json();

      // Example shape:
      // { entry: [{ changes: [{ field: "leadgen", value: { leadgen_id, form_id, page_id } }]}]}
      // For each leadgen event, fetch the lead fields with the page token you stored.

      console.log('Facebook webhook received:', JSON.stringify(body, null, 2));

      // Here: forward to n8n (recommended) OR fetch lead fields right here.
      if (process.env.VITE_N8N_WEBHOOK_URL) {
        await fetch(process.env.VITE_N8N_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
      }

      return new Response(JSON.stringify({ received: true }), { status: 200 });
    } catch (error) {
      console.error('Webhook processing error:', error);
      return new Response(JSON.stringify({ error: 'Webhook processing failed' }), { status: 500 });
    }
  }

  return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
}
