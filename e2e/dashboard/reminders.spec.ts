import { test, expect } from '@playwright/test';

test.describe('Dashboard - Reminders Page', () => {
  // These tests require authentication.
  // Reminders is a Pro-gated page for configuring appointment reminders.
  // To run: set up AUTH_EMAIL and AUTH_PASSWORD env vars or use a test account.

  test.beforeEach(async ({ page }) => {
    await page.goto('/dashboard/reminders');
  });

  test('redirects to login when not authenticated', async ({ page }) => {
    await expect(page).toHaveURL(/\/login/);
  });

  test.describe('Authenticated (requires auth fixture)', () => {
    test.skip('shows reminders configuration page', async () => {
      // Would verify:
      // - Page heading "Reminders"
      // - Reminder type toggles (SMS, email)
      // - Timing configuration (24h before, 1h before, etc.)
    });

    test.skip('shows reminder templates', async () => {
      // Would verify:
      // - Default reminder message templates
      // - Customizable message text
      // - Variable placeholders (client name, appointment time, etc.)
    });

    test.skip('shows reminder history', async () => {
      // Would verify:
      // - List of sent reminders
      // - Delivery status (sent, delivered, failed)
      // - Response tracking
    });
  });
});
