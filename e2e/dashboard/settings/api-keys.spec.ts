import { test, expect } from '@playwright/test';

test.describe('Dashboard Settings - API Keys Page', () => {
  // These tests require authentication.
  // API Keys page for managing API access tokens.
  // To run: set up AUTH_EMAIL and AUTH_PASSWORD env vars or use a test account.

  test.beforeEach(async ({ page }) => {
    await page.goto('/dashboard/settings/api-keys');
  });

  test('redirects to login when not authenticated', async ({ page }) => {
    await expect(page).toHaveURL(/\/login/);
  });

  test.describe('Authenticated (requires auth fixture)', () => {
    test.skip('shows API keys page heading', async () => {
      // Would verify:
      // - Page heading "API Keys"
      // - Create new API key button
    });

    test.skip('shows API key list or empty state', async () => {
      // Would verify:
      // - List of existing API keys (masked)
      // - Each key: name, created date, last used
      // - Copy button for each key
      // - Delete/revoke button
      // - Empty state if no keys created
    });

    test.skip('create new API key dialog', async () => {
      // Would verify:
      // - Click create opens dialog
      // - Name input for the key
      // - Permission/scope selector
      // - Generate button
      // - Displays the key once (with copy button)
    });

    test.skip('can revoke an API key', async () => {
      // Would verify:
      // - Revoke button triggers confirmation dialog
      // - Key is removed from list after confirmation
    });
  });
});
