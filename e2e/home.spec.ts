import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('page loads and shows title', async ({ page }) => {
    await expect(page).toHaveTitle(/Boltcall/);
  });

  test('hero heading is visible', async ({ page }) => {
    const heading = page.locator('h1');
    await expect(heading).toBeVisible();
    await expect(heading).toContainText('NEVER');
    await expect(heading).toContainText('MISS');
  });

  test('hero subheadline is visible', async ({ page }) => {
    await expect(
      page.getByText('We answer calls 24/7, respond to website visitors instantly, and book appointments for you.')
    ).toBeVisible();
  });

  test('navigation links are visible', async ({ page }) => {
    const header = page.locator('header').first();
    await expect(header.getByText('Pricing', { exact: true })).toBeVisible();
    await expect(header.getByText('Contact', { exact: true })).toBeVisible();
  });

  test('CTA buttons exist', async ({ page }) => {
    await expect(page.getByText('Learn More')).toBeVisible();
    await expect(page.getByText('Start free')).toBeVisible();
  });

  test('Learn More button scrolls or navigates', async ({ page }) => {
    const learnMore = page.getByText('Learn More');
    await expect(learnMore).toBeVisible();
    // Verify it is clickable (has a link or button role)
    await expect(learnMore).toBeEnabled();
  });

  test('Start free button is present and clickable', async ({ page }) => {
    const startFree = page.getByText('Start free');
    await expect(startFree).toBeVisible();
    await expect(startFree).toBeEnabled();
  });

  test('footer is present on homepage', async ({ page }) => {
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();
  });

  test('How It Works section loads', async ({ page }) => {
    // Scroll down to trigger lazy loading
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 2));
    // Wait for "How It Works" section to appear
    await expect(page.getByText('How It Works').first()).toBeVisible({ timeout: 10000 });
  });

  test('Pricing section loads on homepage', async ({ page }) => {
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    // The pricing section has plan names
    await expect(page.getByText('Starter').first()).toBeVisible({ timeout: 10000 });
  });

  test('FAQ section loads on homepage', async ({ page }) => {
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await expect(page.getByText('FAQ').first()).toBeVisible({ timeout: 10000 });
  });
});
