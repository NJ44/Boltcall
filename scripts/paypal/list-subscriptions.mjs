// List PayPal subscriptions tied to your account, scoped per plan.
// Usage:
//   node scripts/paypal/list-subscriptions.mjs <plan_id>
//   node scripts/paypal/list-subscriptions.mjs <plan_id> ACTIVE
//
// PayPal's REST API requires a plan_id filter — there's no global
// "list all subscriptions" endpoint. Run list-plans.mjs first to get IDs.

import { paypal, banner, fail } from './_client.mjs';

const [planId, statusArg] = process.argv.slice(2);
if (!planId) {
  console.error('Usage: node scripts/paypal/list-subscriptions.mjs <plan_id> [status]');
  console.error('  status: ACTIVE | SUSPENDED | CANCELLED | EXPIRED (default: all)');
  process.exit(2);
}

banner(`Subscriptions for plan ${planId}`);

try {
  const params = new URLSearchParams({ plan_ids: planId });
  if (statusArg) params.set('status', statusArg);
  const data = await paypal('GET', `/v1/billing/subscriptions?${params.toString()}`);
  const subs = data.subscriptions || [];
  if (subs.length === 0) {
    console.log('\nNo subscriptions for this plan.');
    process.exit(0);
  }
  console.log(`\nFound ${subs.length} subscription(s):\n`);
  for (const s of subs) {
    const email = s.subscriber?.email_address || '(no email)';
    console.log(`  ${s.id}  ${s.status.padEnd(10)}  ${email}  next: ${s.billing_info?.next_billing_time || '-'}`);
  }
  console.log();
} catch (err) {
  fail(err);
}
