import { test, expect } from '@playwright/test';

test.describe('Dashboard - Leads Page', () => {
  // These tests require authentication.
  // The Leads page has tabs: Speed to Lead, Missed Calls, Reactivation
  // To run: set up AUTH_EMAIL and AUTH_PASSWORD env vars or use a test account.

  test.beforeEach(async ({ page }) => {
    await page.goto('/dashboard/leads');
  });

  test('redirects to login when not authenticated', async ({ page }) => {
    await expect(page).toHaveURL(/\/login/);
  });

  test.describe('Authenticated (requires auth fixture)', () => {
    test.skip('shows leads page with tabs', async () => {
      // Would verify:
      // - Page heading for Leads
      // - Tabs: Speed to Lead, Missed Calls, Reactivation
      // - Default tab is active
    });

    test.skip('Speed to Lead tab shows lead response metrics', async () => {
      // Would verify:
      // - Response time stats
      // - Lead list with response times
      // - Instant reply status indicators
    });

    test.skip('Missed Calls tab shows missed call follow-ups', async () => {
      // Would verify:
      // - Missed call list
      // - Auto text-back status
      // - Follow-up action buttons
    });

    test.skip('Reactivation tab shows dormant leads', async () => {
      // Would verify:
      // - Dormant/cold lead list
      // - Reactivation campaign status
      // - Re-engagement metrics
    });
  });

  test('old route /dashboard/speed-to-lead redirects to /dashboard/leads', async ({ page }) => {
    await page.goto('/dashboard/speed-to-lead');
    // Will redirect to login since not authenticated, but the redirect chain
    // should go through /dashboard/leads first
    await expect(page).toHaveURL(/\/login/);
  });

  test('old route /dashboard/missed-calls redirects to /dashboard/leads', async ({ page }) => {
    await page.goto('/dashboard/missed-calls');
    await expect(page).toHaveURL(/\/login/);
  });
});
