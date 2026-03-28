import { test, expect } from '@playwright/test';

test.describe('Dashboard Settings - Plan & Billing Page', () => {
  // These tests require authentication.
  // Plan & Billing page shows current subscription and payment info.
  // To run: set up AUTH_EMAIL and AUTH_PASSWORD env vars or use a test account.

  test.beforeEach(async ({ page }) => {
    await page.goto('/dashboard/settings/plan-billing');
  });

  test('redirects to login when not authenticated', async ({ page }) => {
    await expect(page).toHaveURL(/\/login/);
  });

  test('old /dashboard/settings/billing redirects', async ({ page }) => {
    await page.goto('/dashboard/settings/billing');
    // Redirects to plan-billing, then to login since not authenticated
    await expect(page).toHaveURL(/\/login/);
  });

  test.describe('Authenticated (requires auth fixture)', () => {
    test.skip('shows current plan information', async () => {
      // Would verify:
      // - Current plan name (Starter, Pro, Ultimate)
      // - Plan price and billing period
      // - Token usage/allowance
      // - Upgrade/downgrade buttons
    });

    test.skip('shows billing history', async () => {
      // Would verify:
      // - Invoice list with dates and amounts
      // - Download invoice links
      // - Payment method display
    });

    test.skip('shows plan comparison for upgrade', async () => {
      // Would verify:
      // - Feature comparison between plans
      // - Upgrade CTA buttons
      // - Stripe checkout integration
    });
  });
});
