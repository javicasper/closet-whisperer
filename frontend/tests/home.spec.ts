import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
  test('should load homepage', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toContainText('Welcome to Closet Whisperer');
  });

  test('should have navigation links', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('text=My Closet')).toBeVisible();
    await expect(page.locator('text=Outfits')).toBeVisible();
    await expect(page.locator('text=AI Builder')).toBeVisible();
    await expect(page.locator('text=Laundry')).toBeVisible();
  });

  test('should navigate to closet page', async ({ page }) => {
    await page.goto('/');
    await page.click('text=View My Closet');
    await expect(page).toHaveURL('/closet');
  });
});
