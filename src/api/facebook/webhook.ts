import { NextApiRequest, NextApiResponse } from 'next';

const VERIFY_TOKEN = process.env.FB_WEBHOOK_VERIFY_TOKEN!;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    // Webhook verification
    const { 'hub.mode': mode, 'hub.verify_token': token, 'hub.challenge': challenge } = req.query;

    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      return res.status(200).send(challenge);
    }
    return res.status(403).send('Forbidden');
  }

  if (req.method === 'POST') {
    // Webhook event handling
    try {
      const body = req.body;

      // Example shape:
      // { entry: [{ changes: [{ field: "leadgen", value: { leadgen_id, form_id, page_id } }]}]}
      // For each leadgen event, fetch the lead fields with the page token you stored.

      console.log('Facebook webhook received:', JSON.stringify(body, null, 2));

      // Here: forward to n8n (recommended) OR fetch lead fields right here.
      if (process.env.N8N_WEBHOOK_URL) {
        await fetch(process.env.N8N_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
      }

      return res.status(200).json({ received: true });
    } catch (error) {
      console.error('Webhook processing error:', error);
      return res.status(500).json({ error: 'Webhook processing failed' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
