import { test, expect } from '@playwright/test';

test.describe('Comparisons Pages', () => {
  test('comparisons hub page loads', async ({ page }) => {
    await page.goto('/comparisons');
    await expect(page).toHaveTitle(/Comparisons/i);
    await expect(page.locator('header').first()).toBeVisible();
    await expect(page.locator('footer')).toBeVisible();
  });

  test('comparisons hub shows comparison cards', async ({ page }) => {
    await page.goto('/comparisons');
    await expect(page.getByText('Call Centers').first()).toBeVisible();
    await expect(page.getByText('Receptionist').first()).toBeVisible();
    await expect(page.getByText('Voicemail').first()).toBeVisible();
    await expect(page.getByText('Answering Services').first()).toBeVisible();
  });

  test('Traditional Call Centers vs Boltcall page loads', async ({ page }) => {
    await page.goto('/comparisons/call-centers-vs-boltcall');
    await expect(page).toHaveTitle(/Traditional Call Centers vs Boltcall/i);
    await expect(page.locator('h1').first()).toBeVisible();
  });

  test('Human Receptionist vs Boltcall page loads', async ({ page }) => {
    await page.goto('/comparisons/receptionist-vs-boltcall');
    await expect(page).toHaveTitle(/Human Receptionist vs Boltcall/i);
    await expect(page.locator('h1').first()).toBeVisible();
  });

  test('Voicemail vs Boltcall page loads', async ({ page }) => {
    await page.goto('/comparisons/voicemail-vs-boltcall');
    await expect(page).toHaveTitle(/Voicemail vs Boltcall/i);
    await expect(page.locator('h1').first()).toBeVisible();
  });

  test('Answering Services vs Boltcall page loads', async ({ page }) => {
    await page.goto('/comparisons/answering-services-vs-boltcall');
    await expect(page).toHaveTitle(/Answering Services vs Boltcall/i);
    await expect(page.locator('h1').first()).toBeVisible();
  });

  test('CRM vs Boltcall page loads', async ({ page }) => {
    await page.goto('/comparisons/crm-vs-boltcall');
    await expect(page).toHaveTitle(/CRM Instant Lead Reply vs Boltcall/i);
    await expect(page.locator('h1').first()).toBeVisible();
  });

  test('competitor comparison: Boltcall vs Podium loads', async ({ page }) => {
    await page.goto('/compare/boltcall-vs-podium');
    await expect(page.locator('h1').first()).toBeVisible();
  });

  test('competitor comparison: Boltcall vs GoHighLevel loads', async ({ page }) => {
    await page.goto('/compare/boltcall-vs-gohighlevel');
    await expect(page.locator('h1').first()).toBeVisible();
  });

  test('competitor comparison: Boltcall vs Birdeye loads', async ({ page }) => {
    await page.goto('/compare/boltcall-vs-birdeye');
    await expect(page.locator('h1').first()).toBeVisible();
  });

  test('competitor comparison: Boltcall vs Emitrr loads', async ({ page }) => {
    await page.goto('/compare/boltcall-vs-emitrr');
    await expect(page.locator('h1').first()).toBeVisible();
  });

  test('competitor comparison: Boltcall vs Calomation loads', async ({ page }) => {
    await page.goto('/compare/boltcall-vs-calomation');
    await expect(page.locator('h1').first()).toBeVisible();
  });

  test('competitor comparison: Boltcall vs Smith.ai loads', async ({ page }) => {
    await page.goto('/compare/boltcall-vs-smith-ai');
    await expect(page.locator('h1').first()).toBeVisible();
  });
});
