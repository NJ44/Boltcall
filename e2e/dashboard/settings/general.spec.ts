import { test, expect } from '@playwright/test';

test.describe('Dashboard Settings - General Page', () => {
  // These tests require authentication.
  // General settings page for business profile and configuration.
  // To run: set up AUTH_EMAIL and AUTH_PASSWORD env vars or use a test account.

  test.beforeEach(async ({ page }) => {
    await page.goto('/dashboard/settings/general');
  });

  test('redirects to login when not authenticated', async ({ page }) => {
    await expect(page).toHaveURL(/\/login/);
  });

  test.describe('Authenticated (requires auth fixture)', () => {
    test.skip('shows general settings form', async () => {
      // Would verify:
      // - Page heading "General" or "General Settings"
      // - Business name input field
      // - Business phone input field
      // - Business address fields
      // - Industry/category selector
      // - Save button
    });

    test.skip('form fields are editable', async () => {
      // Would verify:
      // - Can type in business name
      // - Can update phone number
      // - Can change industry
    });

    test.skip('save button submits form', async () => {
      // Would verify:
      // - Save button is clickable
      // - Success toast appears after save
    });
  });
});
