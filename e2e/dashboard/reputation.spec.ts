import { test, expect } from '@playwright/test';

test.describe('Dashboard - Reputation Management Page', () => {
  // These tests require authentication.
  // Reputation is a Pro-gated page for managing Google reviews.
  // To run: set up AUTH_EMAIL and AUTH_PASSWORD env vars or use a test account.

  test.beforeEach(async ({ page }) => {
    await page.goto('/dashboard/reputation');
  });

  test('redirects to login when not authenticated', async ({ page }) => {
    await expect(page).toHaveURL(/\/login/);
  });

  test.describe('Authenticated (requires auth fixture)', () => {
    test.skip('shows reputation page heading', async () => {
      // Would verify:
      // - Page heading "Reputation" or "Reviews"
      // - Google reviews integration status
    });

    test.skip('displays review metrics', async () => {
      // Would verify:
      // - Average rating display
      // - Total reviews count
      // - Review request sent count
      // - Review response rate
    });

    test.skip('shows automated review request settings', async () => {
      // Would verify:
      // - Toggle for automatic review requests
      // - Template customization
      // - Timing configuration (after service completion)
    });
  });
});
