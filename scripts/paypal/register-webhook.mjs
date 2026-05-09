// Register a webhook URL with PayPal for the events Boltcall handles.
// Usage:
//   node scripts/paypal/register-webhook.mjs https://boltcall.org/.netlify/functions/paypal-webhook
//
// Save the returned ID to .env as PAYPAL_WEBHOOK_ID (live) or
// PAYPAL_SANDBOX_WEBHOOK_ID (sandbox). The webhook handler uses it to verify
// signatures.

import { paypal, banner, fail, MODE } from './_client.mjs';

const url = process.argv[2];
if (!url) {
  console.error('Usage: node scripts/paypal/register-webhook.mjs <webhook_url>');
  console.error('Example: https://boltcall.org/.netlify/functions/paypal-webhook');
  process.exit(2);
}
if (!url.startsWith('https://')) {
  fail(new Error('Webhook URL must use https://'));
}

const EVENT_TYPES = [
  'CHECKOUT.ORDER.APPROVED',
  'PAYMENT.CAPTURE.COMPLETED',
  'PAYMENT.SALE.COMPLETED',
  'BILLING.SUBSCRIPTION.ACTIVATED',
  'BILLING.SUBSCRIPTION.RE-ACTIVATED',
  'BILLING.SUBSCRIPTION.CANCELLED',
  'BILLING.SUBSCRIPTION.EXPIRED',
  'BILLING.SUBSCRIPTION.SUSPENDED',
];

banner(`Register webhook: ${url}`);

try {
  const webhook = await paypal('POST', '/v1/notifications/webhooks', {
    url,
    event_types: EVENT_TYPES.map(name => ({ name })),
  });
  const envKey = MODE === 'sandbox' ? 'PAYPAL_SANDBOX_WEBHOOK_ID' : 'PAYPAL_WEBHOOK_ID';
  console.log('\n✔ Webhook registered');
  console.log(`  ID:  ${webhook.id}`);
  console.log(`  URL: ${webhook.url}`);
  console.log(`\n→ Add to .env:`);
  console.log(`  ${envKey}=${webhook.id}\n`);
} catch (err) {
  fail(err);
}
