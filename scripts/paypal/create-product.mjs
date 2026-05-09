// Create the Boltcall product (one per environment).
// Usage: node scripts/paypal/create-product.mjs
//
// PayPal subscription Plans must be tied to a Product. Run this once per
// environment (sandbox / live) and save the returned ID to:
//   sandbox → PAYPAL_PRODUCT_ID_SANDBOX
//   live    → PAYPAL_PRODUCT_ID

import { paypal, banner, fail, MODE } from './_client.mjs';

banner('Create Boltcall product');

try {
  const product = await paypal('POST', '/v1/catalogs/products', {
    name: 'Boltcall — Speed-to-Lead Platform',
    description: 'AI-powered speed-to-lead platform for local service businesses. Every inbound lead responded to instantly and booked on the calendar.',
    type: 'SERVICE',
    category: 'SOFTWARE',
    home_url: 'https://boltcall.org',
  });
  console.log('\n✔ Product created');
  console.log(`  ID:   ${product.id}`);
  console.log(`  Name: ${product.name}`);
  console.log(`\n→ Add to .env:`);
  console.log(`  PAYPAL_PRODUCT_ID${MODE === 'sandbox' ? '_SANDBOX' : ''}=${product.id}\n`);
} catch (err) {
  fail(err);
}
