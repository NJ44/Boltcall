// Cancel a PayPal subscription. Cancellation is permanent — to pause use suspend.
// Usage: node scripts/paypal/cancel-subscription.mjs <subscription_id> "<reason>"

import { paypal, banner, fail } from './_client.mjs';

const id = process.argv[2];
const reason = process.argv[3] || 'Cancelled via Boltcall admin';
if (!id) {
  console.error('Usage: node scripts/paypal/cancel-subscription.mjs <subscription_id> "<reason>"');
  process.exit(2);
}

banner(`Cancel subscription ${id}`);
console.log(`Reason: ${reason}\n`);

try {
  await paypal('POST', `/v1/billing/subscriptions/${id}/cancel`, { reason });
  console.log('✔ Subscription cancelled');
  console.log('  Webhook BILLING.SUBSCRIPTION.CANCELLED will fire and update Supabase.');
} catch (err) {
  fail(err);
}
