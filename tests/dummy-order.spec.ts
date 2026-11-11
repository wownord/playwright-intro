import { test, expect } from '@playwright/test';
import path from 'path';

// local practice page from the lesson: html/dummy-order.html
const pageUrl = 'file://' + path.resolve(__dirname, '../html/dummy-order.html');

test.describe('Locators practice: dummy order page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(pageUrl);
  });

  test('find "Place your order" button with different locators', async ({ page }) => {
    // CSS by id
    await expect(page.locator('#submit-order')).toBeVisible();
    // CSS by attribute
    await expect(page.locator('[data-testid="submit-order"]')).toBeVisible();
    // XPath
    await expect(page.locator('xpath=//button[@id="submit-order"]')).toBeVisible();
    // Playwright locators
    await expect(page.getByRole('button', { name: 'Place your order' })).toBeVisible();
    await expect(page.getByTestId('submit-order')).toBeVisible();
    await expect(page.getByTitle('Submit Button')).toBeVisible();
    await expect(page.getByText('Place your order')).toBeVisible();
  });

  test('find input fields by label, placeholder and test id', async ({ page }) => {
    await expect(page.getByLabel('Username:')).toBeVisible();
    await expect(page.getByPlaceholder('Enter your email')).toBeVisible();
    await expect(page.getByTestId('username')).toBeEditable();
  });

  test('button is disabled until username and valid email are filled', async ({ page }) => {
    const submitButton = page.getByTestId('submit-order');
    await expect(submitButton).toBeDisabled();

    await page.getByLabel('Username:').fill('wownord');
    await page.getByLabel('Email:').fill('not-an-email');
    await expect(submitButton).toBeDisabled();

    await page.getByLabel('Email:').fill('wownord@example.com');
    await expect(submitButton).toBeEnabled();
  });

  test('click on enabled button shows "OK" popup', async ({ page }) => {
    await page.getByLabel('Username:').fill('wownord');
    await page.getByLabel('Email:').fill('wownord@example.com');

    await page.getByTestId('submit-order').click();

    await expect(page.locator('#popup-message')).toBeVisible();
    await expect(page.locator('#popup-message')).toHaveText('OK');
  });
});
