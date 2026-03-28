import { test, expect } from '@playwright/test';

test.describe('Dashboard - Main Page', () => {
  // These tests require authentication.
  // To run authenticated tests: set up AUTH_EMAIL and AUTH_PASSWORD env vars
  // or use a test account with beforeEach login helper.

  test('redirects to login when not authenticated', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForURL(/\/login/);
    await expect(page).toHaveURL(/\/login/);
  });

  test('dashboard/* routes redirect to login when not authenticated', async ({ page }) => {
    await page.goto('/dashboard/agents');
    await page.waitForURL(/\/login/);
    await expect(page).toHaveURL(/\/login/);
  });

  test.describe('Authenticated dashboard (requires auth fixture)', () => {
    // These tests need a logged-in session to pass.
    // Skipped until auth fixtures are available.

    test.skip('shows dashboard page with onboarding checklist', async () => {
      // Would verify:
      // - Dashboard page heading
      // - Onboarding checklist or overview cards
      // - Sidebar navigation visible
      // - Top bar with user avatar/menu
    });

    test.skip('sidebar navigation has all expected links', async () => {
      // Would verify sidebar links:
      // - Dashboard, Agents, Calls, Leads, Messages
      // - Analytics, Knowledge Base, Integrations
      // - Phone Numbers, Reputation, Reminders, Voice Library
      // - Settings
    });
  });
});
