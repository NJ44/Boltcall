// Suspend (pause) a PayPal subscription — billing stops, can be activated later.
// Usage: node scripts/paypal/suspend-subscription.mjs <subscription_id> "<reason>"

import { paypal, banner, fail } from './_client.mjs';

const id = process.argv[2];
const reason = process.argv[3] || 'Paused via Boltcall admin';
if (!id) {
  console.error('Usage: node scripts/paypal/suspend-subscription.mjs <subscription_id> "<reason>"');
  process.exit(2);
}

banner(`Suspend subscription ${id}`);
console.log(`Reason: ${reason}\n`);

try {
  await paypal('POST', `/v1/billing/subscriptions/${id}/suspend`, { reason });
  console.log('✔ Subscription suspended (billing paused)');
  console.log('  To resume:  POST /v1/billing/subscriptions/{id}/activate');
} catch (err) {
  fail(err);
}
