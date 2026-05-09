// Get full details of a PayPal subscription by ID.
// Usage: node scripts/paypal/get-subscription.mjs <subscription_id>

import { paypal, banner, fail } from './_client.mjs';

const id = process.argv[2];
if (!id) {
  console.error('Usage: node scripts/paypal/get-subscription.mjs <subscription_id>');
  process.exit(2);
}

banner(`Subscription ${id}`);

try {
  const sub = await paypal('GET', `/v1/billing/subscriptions/${id}`);
  console.log(JSON.stringify(sub, null, 2));
} catch (err) {
  fail(err);
}
