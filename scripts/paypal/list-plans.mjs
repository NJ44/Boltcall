// List all PayPal subscription Plans.
// Usage: node scripts/paypal/list-plans.mjs

import { paypal, banner, fail } from './_client.mjs';

banner('PayPal subscription plans');

try {
  const data = await paypal('GET', '/v1/billing/plans?page_size=20&total_required=true');
  const plans = data.plans || [];
  if (plans.length === 0) {
    console.log('\nNo plans found. Use create-plan.mjs to create one.');
    process.exit(0);
  }
  console.log(`\nFound ${data.total_items ?? plans.length} plan(s):\n`);
  for (const plan of plans) {
    console.log(`  ${plan.id}  ${plan.status.padEnd(10)}  ${plan.name}`);
  }
  console.log();
} catch (err) {
  fail(err);
}
