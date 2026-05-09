-- PayPal billing schema additions
--
-- Most PayPal columns and the paypal_payments table were already applied
-- ad-hoc in production before this migration was written (prod was ahead of
-- the migrations folder). This migration captures the remaining gaps and is
-- idempotent so it's safe to re-run on any environment.
--
-- Adds:
--   1. CHECK constraint on subscriptions.payment_provider (was loose text)
--   2. subscriptions.paypal_plan_id              — which PayPal Plan (P-XXX) the sub is on
--   3. invoices.paypal_capture_id (UNIQUE)       — PayPal capture ID for recurring charges
--   4. invoices.paypal_subscription_id           — denormalized subscription ref for fast lookup
--   5. Index on invoices.paypal_subscription_id  — webhook lookup path

-- 1. Constrain payment_provider values
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'subscriptions_payment_provider_check'
  ) THEN
    ALTER TABLE subscriptions
      ADD CONSTRAINT subscriptions_payment_provider_check
      CHECK (payment_provider IN ('stripe', 'paypal'));
  END IF;
END $$;

-- 2. Track which PayPal Plan (P-XXX) a subscription is on
ALTER TABLE subscriptions
  ADD COLUMN IF NOT EXISTS paypal_plan_id TEXT;

-- 3. + 4. PayPal fields on invoices for recurring-charge ledger
ALTER TABLE invoices
  ADD COLUMN IF NOT EXISTS paypal_capture_id TEXT,
  ADD COLUMN IF NOT EXISTS paypal_subscription_id TEXT;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'invoices_paypal_capture_id_key'
  ) THEN
    ALTER TABLE invoices
      ADD CONSTRAINT invoices_paypal_capture_id_key UNIQUE (paypal_capture_id);
  END IF;
END $$;

-- 5. Webhook lookup index
CREATE INDEX IF NOT EXISTS idx_invoices_paypal_subscription_id
  ON invoices (paypal_subscription_id)
  WHERE paypal_subscription_id IS NOT NULL;
