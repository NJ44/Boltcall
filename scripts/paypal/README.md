# PayPal admin CLI

Node scripts for managing PayPal billing without leaving the terminal. Each script reads `.env` at the repo root and picks **sandbox or live** credentials based on `PAYPAL_MODE`.

Switch modes by setting `PAYPAL_MODE` inline or in `.env`:
```bash
PAYPAL_MODE=sandbox node scripts/paypal/list-plans.mjs
PAYPAL_MODE=live    node scripts/paypal/list-plans.mjs
```

Every script prints `[sandbox]` or `[live]` in the banner so you can't lose track of which environment you're hitting.

## One-time setup (per environment)

```bash
# 1. Create the Boltcall product (one product, many plans tied to it)
node scripts/paypal/create-product.mjs
# → save returned ID to .env

# 2. Create one plan per (tier × interval)
node scripts/paypal/create-plan.mjs starter monthly 549
node scripts/paypal/create-plan.mjs starter yearly 4941
node scripts/paypal/create-plan.mjs pro     monthly 897
node scripts/paypal/create-plan.mjs pro     yearly 8073
node scripts/paypal/create-plan.mjs ultimate monthly 4997
node scripts/paypal/create-plan.mjs ultimate yearly 44973
# → save each P-XXX ID to .env

# 3. Register the webhook
node scripts/paypal/register-webhook.mjs https://boltcall.org/.netlify/functions/paypal-webhook
# → save returned webhook ID to .env
```

## Day-to-day operations

```bash
# Inventory
node scripts/paypal/list-plans.mjs
node scripts/paypal/list-webhooks.mjs
node scripts/paypal/list-subscriptions.mjs P-XXXX [ACTIVE|SUSPENDED|CANCELLED]
node scripts/paypal/get-subscription.mjs I-XXXX

# Customer service
node scripts/paypal/cancel-subscription.mjs I-XXXX "Customer requested"
node scripts/paypal/suspend-subscription.mjs I-XXXX "Payment dispute"
node scripts/paypal/refund-capture.mjs CAPTURE_ID                       # full refund
node scripts/paypal/refund-capture.mjs CAPTURE_ID 100.00 USD "Goodwill" # partial
```

## What the scripts do not do

- **Reactivate suspended subs:** PayPal endpoint exists (`POST /v1/billing/subscriptions/{id}/activate`) — add a wrapper if needed.
- **Update an active plan's price:** PayPal plans are immutable on price. To change a price, create a new plan and migrate subscribers.
- **Webhook event simulation:** use the simulator at https://developer.paypal.com/dashboard/webhooks/simulator instead.
