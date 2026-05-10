-- Add a proper UNIQUE constraint on subscriptions.paypal_subscription_id so
-- the webhook's `.upsert({...}, { onConflict: 'paypal_subscription_id' })` works.
-- The two existing indexes were PARTIAL (WHERE paypal_subscription_id IS NOT NULL),
-- which Postgres rejects as a target for ON CONFLICT inference.
--
-- Discovered during sandbox e2e test 2026-05-10: webhook returned 500 with
-- "there is no unique or exclusion constraint matching the ON CONFLICT specification"
-- when BILLING.SUBSCRIPTION.ACTIVATED arrived for sub I-LVSWDVBU1E4A.
--
-- UNIQUE constraints allow multiple NULLs, so existing Stripe-only rows
-- (NULL paypal_subscription_id) won't conflict.

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'subscriptions_paypal_subscription_id_key'
  ) THEN
    DROP INDEX IF EXISTS idx_subscriptions_paypal_sub_id;
    DROP INDEX IF EXISTS idx_subscriptions_paypal_subscription_id;

    ALTER TABLE subscriptions
      ADD CONSTRAINT subscriptions_paypal_subscription_id_key
      UNIQUE (paypal_subscription_id);
  END IF;
END $$;
