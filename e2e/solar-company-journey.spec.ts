/**
 * Solar Company Full Journey — End-to-End Test
 *
 * Simulates a real user from ABC Solar Solutions:
 *   1. Signs up for a new account
 *   2. Completes the onboarding wizard
 *   3. Explores and interacts with key dashboard features
 *
 * Run with a pre-created test account:
 *   AUTH_EMAIL=solar@test.com AUTH_PASSWORD=TestSolar123! npx playwright test e2e/solar-company-journey.spec.ts --headed
 *
 * Or to test the full signup flow (requires Supabase email confirmation disabled):
 *   npx playwright test e2e/solar-company-journey.spec.ts --headed
 */

import { test, expect } from '@playwright/test';

// ─── Test persona ────────────────────────────────────────────────────────────
const TIMESTAMP = Date.now();
const TEST_EMAIL = `solar-test-${TIMESTAMP}@testboltcall.com`;
const TEST_PASSWORD = 'TestSolar123!';

const SOLAR = {
  fullName: 'Sarah Chen',
  workEmail: TEST_EMAIL,
  businessName: 'ABC Solar Solutions',
  industry: 'Other', // Solar isn't in the list; closest is Other
  country: 'United States',
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Select a Radix UI <Select> value by clicking the trigger then the option.
 * @param page     Playwright page
 * @param triggerId  The `id` on the <SelectTrigger> element
 * @param optionText The visible label of the option to pick
 */
async function selectRadixOption(
  page: import('@playwright/test').Page,
  triggerId: string,
  optionText: string
) {
  // Click the trigger to open the dropdown
  await page.locator(`#${triggerId}`).click();
  // Wait for the dropdown to open, then pick the option
  await page.getByRole('option', { name: optionText, exact: true }).click();
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 1: Signup
// ─────────────────────────────────────────────────────────────────────────────

test.describe('1 · Signup', () => {
  test('signup page renders correctly', async ({ page }) => {
    await page.goto('/signup');
    await expect(page.getByRole('heading', { name: /sign up/i })).toBeVisible();
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('#signup-password')).toBeVisible();
    await expect(page.getByRole('button', { name: /sign up/i })).toBeVisible();
  });

  test('creates a new solar company account', async ({ page }) => {
    await page.goto('/signup');
    await page.waitForLoadState('networkidle');

    // Fill form
    await page.locator('input[type="email"]').fill(TEST_EMAIL);
    await page.locator('#signup-password').fill(TEST_PASSWORD);

    // Screenshot before submitting
    await page.screenshot({ path: 'test-results/01-signup-filled.png', fullPage: false });

    // Submit
    await page.getByRole('button', { name: /sign up/i }).click();

    // After signup the app navigates to /setup (or /login if email confirm required)
    await page.waitForURL(/\/(setup|login)/, { timeout: 15_000 });

    const url = page.url();
    if (url.includes('/login')) {
      // Email confirmation required — skip downstream tests
      console.warn(
        '⚠️  Supabase email confirmation is ON. ' +
          'Disable it in Supabase Auth settings for full e2e testing, ' +
          'or use AUTH_EMAIL / AUTH_PASSWORD with a pre-confirmed account.'
      );
      test.skip();
    }

    await expect(page).toHaveURL(/\/setup/);
    await page.screenshot({ path: 'test-results/02-redirected-to-setup.png' });
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 2: Onboarding Wizard  (uses AUTH_EMAIL / AUTH_PASSWORD if set)
// ─────────────────────────────────────────────────────────────────────────────

test.describe('2 · Onboarding wizard', () => {
  test.skip(!process.env.AUTH_EMAIL, 'Set AUTH_EMAIL + AUTH_PASSWORD to run wizard tests');

  test.beforeEach(async ({ page }) => {
    // Log in with the pre-confirmed test account
    await page.goto('/login');
    await page.waitForLoadState('networkidle');
    await page.locator('input[type="email"]').fill(process.env.AUTH_EMAIL!);
    await page.locator('#login-password').fill(process.env.AUTH_PASSWORD!);
    await page.getByRole('button', { name: /login/i }).click();
    await page.waitForURL(/\/(dashboard|setup)/, { timeout: 15_000 });

    // Force navigate to /setup (resets store on load)
    await page.goto('/setup');
    await page.waitForLoadState('networkidle');
  });

  test('step 0 — Personal Profile', async ({ page }) => {
    // Step 0 should be visible
    await expect(page.getByText('Personal Profile')).toBeVisible();

    // Fill Full Name
    await page.locator('#fullName').fill(SOLAR.fullName);

    // Fill Work Email
    await page.locator('#workEmail').fill(SOLAR.workEmail);

    // Select Country via Radix Select
    await selectRadixOption(page, 'country', SOLAR.country);

    await page.screenshot({ path: 'test-results/03-setup-step0.png' });

    // Next should be enabled
    const nextBtn = page.getByRole('button', { name: /next/i });
    await expect(nextBtn).not.toBeDisabled();
    await nextBtn.click();

    // Should now be on step 1
    await expect(page.getByText('Business Profile')).toBeVisible();
    await page.screenshot({ path: 'test-results/04-setup-step1.png' });
  });

  test('step 1 — Business Profile', async ({ page }) => {
    // Navigate to step 1
    await page.locator('#fullName').fill(SOLAR.fullName);
    await page.locator('#workEmail').fill(SOLAR.workEmail);
    await selectRadixOption(page, 'country', SOLAR.country);
    await page.getByRole('button', { name: /next/i }).click();
    await expect(page.getByText('Business Profile')).toBeVisible();

    // Fill Business Name
    await page.locator('#businessName').fill(SOLAR.businessName);

    // Select Industry
    await selectRadixOption(page, 'industry', SOLAR.industry);

    await page.screenshot({ path: 'test-results/05-setup-step1-filled.png' });

    // Next
    const nextBtn = page.getByRole('button', { name: /next/i });
    await expect(nextBtn).not.toBeDisabled();
    await nextBtn.click();

    // Should now be on Review & Launch
    await expect(page.getByText('Ready to launch')).toBeVisible();
    await page.screenshot({ path: 'test-results/06-setup-step2-review.png' });
  });

  test('step 2 — Review & Launch', async ({ page }) => {
    // Navigate through all steps
    await page.locator('#fullName').fill(SOLAR.fullName);
    await page.locator('#workEmail').fill(SOLAR.workEmail);
    await selectRadixOption(page, 'country', SOLAR.country);
    await page.getByRole('button', { name: /next/i }).click();
    await page.locator('#businessName').fill(SOLAR.businessName);
    await selectRadixOption(page, 'industry', SOLAR.industry);
    await page.getByRole('button', { name: /next/i }).click();

    // Verify review cards show correct data
    await expect(page.getByText(SOLAR.fullName)).toBeVisible();
    await expect(page.getByText(SOLAR.businessName)).toBeVisible();

    await page.screenshot({ path: 'test-results/07-setup-review-verified.png' });

    // Launch!
    await page.getByRole('button', { name: /launch/i }).click();

    // Should go to /setup/loading then eventually /dashboard
    await page.waitForURL(/\/setup\/loading/, { timeout: 10_000 });
    await page.screenshot({ path: 'test-results/08-setup-loading.png' });

    // Wait for final redirect to dashboard (agent creation runs in background)
    await page.waitForURL(/\/dashboard/, { timeout: 30_000 });
    await page.screenshot({ path: 'test-results/09-dashboard-landed.png' });
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 3: Dashboard Overview
// ─────────────────────────────────────────────────────────────────────────────

test.describe('3 · Dashboard overview', () => {
  test.skip(!process.env.AUTH_EMAIL, 'Set AUTH_EMAIL + AUTH_PASSWORD to run dashboard tests');

  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.waitForLoadState('networkidle');
    await page.locator('input[type="email"]').fill(process.env.AUTH_EMAIL!);
    await page.locator('#login-password').fill(process.env.AUTH_PASSWORD!);
    await page.getByRole('button', { name: /login/i }).click();
    await page.waitForURL(/\/dashboard/, { timeout: 15_000 });
  });

  test('dashboard loads with key UI elements', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');

    // Sidebar should be visible
    await expect(page.locator('nav, aside').first()).toBeVisible();

    await page.screenshot({ path: 'test-results/10-dashboard-overview.png', fullPage: true });
  });

  test('sidebar navigation items are present', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');

    // Agents link
    await expect(page.getByRole('link', { name: /agents/i }).first()).toBeVisible();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 4: Agents Page
// ─────────────────────────────────────────────────────────────────────────────

test.describe('4 · Agents page', () => {
  test.skip(!process.env.AUTH_EMAIL, 'Set AUTH_EMAIL + AUTH_PASSWORD to run agents tests');

  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.waitForLoadState('networkidle');
    await page.locator('input[type="email"]').fill(process.env.AUTH_EMAIL!);
    await page.locator('#login-password').fill(process.env.AUTH_PASSWORD!);
    await page.getByRole('button', { name: /login/i }).click();
    await page.waitForURL(/\/dashboard/, { timeout: 15_000 });
  });

  test('agents page loads and shows list or empty state', async ({ page }) => {
    await page.goto('/dashboard/agents');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1500); // wait for async data fetch

    await page.screenshot({ path: 'test-results/11-agents-page.png', fullPage: true });

    // Either agent rows exist or an empty state / create button is visible
    const hasAgents = await page.locator('table tbody tr, [data-testid="agent-row"]').count() > 0;
    const hasCreateBtn = await page.getByRole('button', { name: /create|new agent/i }).isVisible().catch(() => false);
    const hasEmptyState = await page.getByText(/no agents|create your first/i).isVisible().catch(() => false);

    expect(hasAgents || hasCreateBtn || hasEmptyState).toBeTruthy();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 5: Knowledge Base
// ─────────────────────────────────────────────────────────────────────────────

test.describe('5 · Knowledge base', () => {
  test.skip(!process.env.AUTH_EMAIL, 'Set AUTH_EMAIL + AUTH_PASSWORD to run KB tests');

  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.waitForLoadState('networkidle');
    await page.locator('input[type="email"]').fill(process.env.AUTH_EMAIL!);
    await page.locator('#login-password').fill(process.env.AUTH_PASSWORD!);
    await page.getByRole('button', { name: /login/i }).click();
    await page.waitForURL(/\/dashboard/, { timeout: 15_000 });
  });

  test('knowledge base page loads', async ({ page }) => {
    await page.goto('/dashboard/knowledge-base');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1500);

    await page.screenshot({ path: 'test-results/12-knowledge-base.png', fullPage: true });

    // Should not be a blank page
    const bodyText = await page.locator('body').innerText();
    expect(bodyText.length).toBeGreaterThan(100);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 6: Settings — General
// ─────────────────────────────────────────────────────────────────────────────

test.describe('6 · Settings — General', () => {
  test.skip(!process.env.AUTH_EMAIL, 'Set AUTH_EMAIL + AUTH_PASSWORD to run settings tests');

  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.waitForLoadState('networkidle');
    await page.locator('input[type="email"]').fill(process.env.AUTH_EMAIL!);
    await page.locator('#login-password').fill(process.env.AUTH_PASSWORD!);
    await page.getByRole('button', { name: /login/i }).click();
    await page.waitForURL(/\/dashboard/, { timeout: 15_000 });
  });

  test('general settings page loads with business form', async ({ page }) => {
    await page.goto('/dashboard/settings/general');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1500);

    await page.screenshot({ path: 'test-results/13-settings-general.png', fullPage: true });

    // Business name field should be present
    const businessNameField = page.locator('input[id="businessName"], input[placeholder*="business" i], input[name="businessName"]').first();
    await expect(businessNameField).toBeVisible({ timeout: 5_000 });
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 7: Navigation sanity — key routes load
// ─────────────────────────────────────────────────────────────────────────────

test.describe('7 · Route sanity', () => {
  test.skip(!process.env.AUTH_EMAIL, 'Set AUTH_EMAIL + AUTH_PASSWORD to run route sanity tests');

  const ROUTES = [
    '/dashboard',
    '/dashboard/agents',
    '/dashboard/knowledge-base',
    '/dashboard/phone',
    '/dashboard/calls',
    '/dashboard/integrations',
    '/dashboard/settings/general',
    '/dashboard/settings/members',
    '/dashboard/settings/notifications',
  ];

  // Login once and store state
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.waitForLoadState('networkidle');
    await page.locator('input[type="email"]').fill(process.env.AUTH_EMAIL!);
    await page.locator('#login-password').fill(process.env.AUTH_PASSWORD!);
    await page.getByRole('button', { name: /login/i }).click();
    await page.waitForURL(/\/dashboard/, { timeout: 15_000 });
  });

  for (const route of ROUTES) {
    test(`${route} loads without blank page`, async ({ page }) => {
      await page.goto(route);
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(1000);

      const slug = route.replace(/\//g, '-').slice(1) || 'dashboard';
      await page.screenshot({ path: `test-results/route-${slug}.png` });

      // Page should not be blank — at minimum the sidebar renders something
      const bodyText = await page.locator('body').innerText();
      expect(bodyText.length).toBeGreaterThan(50);

      // Should NOT have been redirected back to login
      await expect(page).not.toHaveURL(/\/login/);
    });
  }
});
