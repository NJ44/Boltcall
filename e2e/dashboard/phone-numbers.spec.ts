import { test, expect } from '@playwright/test';

test.describe('Dashboard - Phone Numbers Page', () => {
  // These tests require authentication.
  // Phone Numbers is a Starter-gated page for managing Twilio phone numbers.
  // To run: set up AUTH_EMAIL and AUTH_PASSWORD env vars or use a test account.

  test.beforeEach(async ({ page }) => {
    await page.goto('/dashboard/phone');
  });

  test('redirects to login when not authenticated', async ({ page }) => {
    await expect(page).toHaveURL(/\/login/);
  });

  test.describe('Authenticated (requires auth fixture)', () => {
    test.skip('shows phone numbers page heading', async () => {
      // Would verify:
      // - Page heading "Phone Numbers"
      // - Add/buy number button
    });

    test.skip('shows phone number list or empty state', async () => {
      // Would verify:
      // - List of phone numbers with status
      // - Each number shows: number, label, status (active/inactive)
      // - Empty state with "Get your first number" CTA
    });

    test.skip('phone number configuration options', async () => {
      // Would verify:
      // - Forwarding rules
      // - Agent assignment
      // - Call recording toggle
    });
  });
});
