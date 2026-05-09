// Create a PayPal subscription Plan (P-XXX) tied to the Boltcall product.
// Usage:
//   node scripts/paypal/create-plan.mjs <tier> <interval> <price>
//   node scripts/paypal/create-plan.mjs starter monthly 549
//   node scripts/paypal/create-plan.mjs pro yearly 8073
//
// Reads PAYPAL_PRODUCT_ID(_SANDBOX) from .env. Run create-product.mjs first.

import { paypal, banner, fail, MODE } from './_client.mjs';

const [tier, interval, priceArg] = process.argv.slice(2);
if (!tier || !interval || !priceArg) {
  console.error('Usage: node scripts/paypal/create-plan.mjs <tier> <interval> <price>');
  console.error('  tier:     starter | pro | ultimate');
  console.error('  interval: monthly | yearly');
  console.error('  price:    USD value, e.g. 549');
  process.exit(2);
}
if (!['starter', 'pro', 'ultimate'].includes(tier)) fail(new Error(`Unknown tier: ${tier}`));
if (!['monthly', 'yearly'].includes(interval)) fail(new Error(`Unknown interval: ${interval}`));

const price = Number(priceArg);
if (!Number.isFinite(price) || price <= 0) fail(new Error(`Invalid price: ${priceArg}`));

const productEnv = MODE === 'sandbox' ? 'PAYPAL_PRODUCT_ID_SANDBOX' : 'PAYPAL_PRODUCT_ID';
const productId = process.env[productEnv];
if (!productId) fail(new Error(`${productEnv} not set in .env. Run create-product.mjs first.`));

const intervalUnit = interval === 'yearly' ? 'YEAR' : 'MONTH';
const tierLabel = tier.charAt(0).toUpperCase() + tier.slice(1);
const intervalLabel = interval === 'yearly' ? 'Yearly' : 'Monthly';

banner(`Create plan: Boltcall ${tierLabel} ${intervalLabel} ($${price}/${intervalUnit.toLowerCase()})`);

try {
  const plan = await paypal('POST', '/v1/billing/plans', {
    product_id: productId,
    name: `Boltcall ${tierLabel} (${intervalLabel})`,
    description: `Boltcall ${tierLabel} plan, billed ${interval}.`,
    status: 'ACTIVE',
    billing_cycles: [
      {
        frequency: { interval_unit: intervalUnit, interval_count: 1 },
        tenure_type: 'REGULAR',
        sequence: 1,
        total_cycles: 0, // 0 = infinite
        pricing_scheme: {
          fixed_price: { value: price.toFixed(2), currency_code: 'USD' },
        },
      },
    ],
    payment_preferences: {
      auto_bill_outstanding: true,
      setup_fee: { value: '0', currency_code: 'USD' },
      setup_fee_failure_action: 'CONTINUE',
      payment_failure_threshold: 3,
    },
    taxes: { percentage: '0', inclusive: false },
  });

  const envKey = `PAYPAL_PLAN_${tier.toUpperCase()}_${interval.toUpperCase()}${MODE === 'sandbox' ? '_SANDBOX' : ''}`;
  console.log('\n✔ Plan created');
  console.log(`  ID:    ${plan.id}`);
  console.log(`  Name:  ${plan.name}`);
  console.log(`  Price: $${price}/${intervalUnit.toLowerCase()}`);
  console.log(`\n→ Add to .env:`);
  console.log(`  ${envKey}=${plan.id}\n`);
} catch (err) {
  fail(err);
}
