import { test as base, Page } from '@playwright/test';

const AUTH_EMAIL = process.env.AUTH_EMAIL ?? '';
const AUTH_PASSWORD = process.env.AUTH_PASSWORD ?? '';

/**
 * Logs in via the /login form and waits for redirect to /dashboard or /setup.
 * Reuse this fixture in any test that requires an authenticated session.
 */
export async function loginWithCredentials(page: Page, email: string, password: string) {
  await page.goto('/login');
  await page.waitForLoadState('networkidle');

  // Email input (placeholder="Email", type="email")
  await page.locator('input[type="email"]').fill(email);

  // Password input — uses id="login-password" (PasswordInput component)
  await page.locator('#login-password').fill(password);

  // Submit — button text is "LOGIN"
  await page.getByRole('button', { name: /login/i }).click();

  // Wait for redirect to dashboard or setup wizard
  await page.waitForURL(/\/(dashboard|setup)/, { timeout: 15_000 });
}

export const test = base.extend<{
  authenticatedPage: Page;
}>({
  authenticatedPage: async ({ page }, use) => {
    if (!AUTH_EMAIL || !AUTH_PASSWORD) {
      throw new Error(
        'Set AUTH_EMAIL and AUTH_PASSWORD env vars to run authenticated tests.\n' +
          'Example: AUTH_EMAIL=you@example.com AUTH_PASSWORD=yourpass npx playwright test'
      );
    }
    await loginWithCredentials(page, AUTH_EMAIL, AUTH_PASSWORD);
    await use(page);
  },
});

export { expect } from '@playwright/test';
