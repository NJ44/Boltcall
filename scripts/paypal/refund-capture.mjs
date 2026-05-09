// Refund a PayPal capture (a paid charge) — full or partial.
// Usage:
//   node scripts/paypal/refund-capture.mjs <capture_id>                           # full refund
//   node scripts/paypal/refund-capture.mjs <capture_id> 50.00 USD "Goodwill"      # partial

import { paypal, banner, fail } from './_client.mjs';

const [captureId, amount, currency, ...noteParts] = process.argv.slice(2);
const note = noteParts.join(' ') || 'Refund issued via Boltcall admin';

if (!captureId) {
  console.error('Usage: node scripts/paypal/refund-capture.mjs <capture_id> [amount] [currency] ["note"]');
  process.exit(2);
}

banner(`Refund capture ${captureId}`);

const body = { note_to_payer: note };
if (amount) {
  if (!currency) fail(new Error('Currency required when amount specified (e.g. USD).'));
  body.amount = { value: Number(amount).toFixed(2), currency_code: currency.toUpperCase() };
  console.log(`Partial refund: ${body.amount.value} ${body.amount.currency_code}\n`);
} else {
  console.log('Full refund\n');
}

try {
  const result = await paypal('POST', `/v2/payments/captures/${captureId}/refund`, body);
  console.log('✔ Refund issued');
  console.log(`  Refund ID: ${result.id}`);
  console.log(`  Status:    ${result.status}`);
} catch (err) {
  fail(err);
}
