import { test, expect } from '@playwright/test';

test.describe('Dashboard - Agents Page', () => {
  // These tests require authentication.
  // To run: set up AUTH_EMAIL and AUTH_PASSWORD env vars or use a test account.

  test.beforeEach(async ({ page }) => {
    await page.goto('/dashboard/agents');
  });

  test('redirects to login when not authenticated', async ({ page }) => {
    await expect(page).toHaveURL(/\/login/);
  });

  test.describe('Authenticated (requires auth fixture)', () => {
    test.skip('shows agents page heading', async () => {
      // Would verify:
      // - Page heading "Agents" or similar
      // - Create Agent button visible
    });

    test.skip('shows agent list or empty state', async () => {
      // Would verify:
      // - Agent cards/list if agents exist
      // - Empty state message if no agents configured
      // - "Create your first agent" CTA in empty state
    });

    test.skip('agent detail page loads', async () => {
      // Would verify:
      // - Navigate to /dashboard/agents/:agentId
      // - Agent name and configuration visible
      // - Voice, prompt, and settings tabs
    });
  });
});
