import { test, expect } from '@playwright/test';

test.describe('Blog Center', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/blog');
  });

  test('page loads with correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/Blog/i);
  });

  test('header and footer are present', async ({ page }) => {
    await expect(page.locator('header').first()).toBeVisible();
    await expect(page.locator('footer')).toBeVisible();
  });

  test('blog posts are listed', async ({ page }) => {
    // Blog center lists posts as article cards or links
    // Check that at least one blog post title is visible
    await expect(page.getByText('AI Receptionist').first()).toBeVisible({ timeout: 10000 });
  });

  test('blog posts show read time', async ({ page }) => {
    await expect(page.getByText('min read').first()).toBeVisible({ timeout: 10000 });
  });

  test('blog posts show categories', async ({ page }) => {
    await expect(page.getByText('Comparison').first()).toBeVisible({ timeout: 10000 });
  });

  test('individual blog post loads', async ({ page }) => {
    await page.goto('/blog/the-new-reality-for-local-businesses');
    await expect(page.locator('h1').first()).toBeVisible();
  });

  test('blog post about speed-to-lead loads', async ({ page }) => {
    await page.goto('/blog/why-speed-matters');
    await expect(page.locator('h1').first()).toBeVisible();
  });

  test('blog post about AI receptionist how it works loads', async ({ page }) => {
    await page.goto('/blog/how-ai-receptionist-works');
    await expect(page.locator('h1').first()).toBeVisible();
  });
});
