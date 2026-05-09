// List all webhooks registered for the current PayPal app.
// Usage: node scripts/paypal/list-webhooks.mjs

import { paypal, banner, fail } from './_client.mjs';

banner('Registered webhooks');

try {
  const data = await paypal('GET', '/v1/notifications/webhooks');
  const webhooks = data.webhooks || [];
  if (webhooks.length === 0) {
    console.log('\nNo webhooks registered. Use register-webhook.mjs to add one.');
    process.exit(0);
  }
  for (const w of webhooks) {
    console.log(`\n  ID:     ${w.id}`);
    console.log(`  URL:    ${w.url}`);
    const types = (w.event_types || []).map(e => e.name).join(', ');
    console.log(`  Events: ${types || '(none)'}`);
  }
  console.log();
} catch (err) {
  fail(err);
}
