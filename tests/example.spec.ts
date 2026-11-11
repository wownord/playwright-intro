import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Playwright/);
});

test('get started link', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Click the get started link.
  await page.getByRole('link', { name: 'Get started' }).click();

  // Expects page to have a heading with the name of Installation.
  await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
});

// Homework 15: navbar of playwright.dev has GitHub, Discord and dark mode toggle
test.describe('playwright.dev navbar', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://playwright.dev/');
  });

  test('GitHub link is visible', async ({ page }) => {
    const navbar = page.locator('nav.navbar');
    await expect(navbar.locator('a[href="https://github.com/microsoft/playwright"]')).toBeVisible();
  });

  test('Discord link is visible', async ({ page }) => {
    const navbar = page.locator('nav.navbar');
    await expect(navbar.locator('a[href="https://aka.ms/playwright/discord"]')).toBeVisible();
  });

  test('dark mode toggle is visible', async ({ page }) => {
    await expect(page.getByRole('button', { name: /dark and light mode/i })).toBeVisible();
  });
});
