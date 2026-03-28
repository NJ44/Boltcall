import { test, expect } from '@playwright/test';

test.describe('Dashboard - Integrations Page', () => {
  // These tests require authentication.
  // Integrations page is available on all plans (not gated).
  // To run: set up AUTH_EMAIL and AUTH_PASSWORD env vars or use a test account.

  test.beforeEach(async ({ page }) => {
    await page.goto('/dashboard/integrations');
  });

  test('redirects to login when not authenticated', async ({ page }) => {
    await expect(page).toHaveURL(/\/login/);
  });

  test.describe('Authenticated (requires auth fixture)', () => {
    test.skip('shows integrations hub page', async () => {
      // Would verify:
      // - Page heading "Integrations"
      // - Search input for filtering integrations
      // - Category filter tabs/buttons
    });

    test.skip('displays integration cards', async () => {
      // Would verify:
      // - Grid of integration cards
      // - Each card has: icon, name, description, connect button
      // - Common integrations: Google Calendar, Zapier, etc.
    });

    test.skip('search filters integrations', async () => {
      // Would verify:
      // - Typing in search filters visible integrations
      // - No results state when search has no matches
    });

    test.skip('category filters work', async () => {
      // Would verify:
      // - Clicking category filters shows relevant integrations
      // - "All" category shows everything
    });
  });
});
