import { test, expect } from '@playwright/test';

const orderPageUrl = 'https://basic-ui.tl-academy.ee/';

test.describe('Order page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(orderPageUrl);
  });

  test('TL-16-1 create order button test', async ({ page }) => {
    const createOrderButton = page.getByTestId('create-order-button');
    const orderSuccess = page.getByTestId('order-success');

    // button is disabled while the form is empty
    await expect(createOrderButton).toBeDisabled();

    await page.getByTestId('first-name-input').fill('Anna');
    await page.getByTestId('last-name-input').fill('Tamm');
    await page.getByTestId('email-input').fill('anna.tamm@example.com');
    await page.getByTestId('address-input').fill('Narva mnt 5, Tallinn');

    // all fields are valid -> button is enabled
    await expect(createOrderButton).toBeEnabled();
    await createOrderButton.click();

    // success message with order number and customer name
    await expect(orderSuccess).toBeVisible();
    await expect(page.getByTestId('order-number')).toHaveText(/^#\d{6}$/);
    await expect(page.getByTestId('order-customer')).toHaveText('Anna Tamm');

    // form is reset after the order is created
    await expect(page.getByTestId('first-name-input')).toHaveValue('');
    await expect(createOrderButton).toBeDisabled();
  });

  test('TL-16-2 change language', async ({ page }) => {
    const pageTitle = page.getByTestId('page-title');

    // Russian is the default language
    await expect(page.locator('html')).toHaveAttribute('lang', 'ru');
    await expect(page.getByTestId('language-ru')).toHaveAttribute('aria-current', 'page');
    await expect(pageTitle).toHaveText('Создать заказ');

    // switch to English
    await page.getByTestId('language-en').click();
    await expect(page).toHaveURL(/\/en\/$/);
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(page.getByTestId('language-en')).toHaveAttribute('aria-current', 'page');
    await expect(pageTitle).not.toHaveText('Создать заказ');

    // switch to Estonian
    await page.getByTestId('language-et').click();
    await expect(page).toHaveURL(/\/et\/$/);
    await expect(page.locator('html')).toHaveAttribute('lang', 'et');
    await expect(page.getByTestId('language-et')).toHaveAttribute('aria-current', 'page');

    // back to Russian
    await page.getByTestId('language-ru').click();
    await expect(page).toHaveURL(orderPageUrl);
    await expect(pageTitle).toHaveText('Создать заказ');
  });

  test('TL-16-3 incorrect email blocks create button and shows error', async ({ page }) => {
    const createOrderButton = page.getByTestId('create-order-button');
    const emailInput = page.getByTestId('email-input');
    const emailError = page.getByTestId('email-error');

    await page.getByTestId('first-name-input').fill('Anna');
    await page.getByTestId('last-name-input').fill('Tamm');
    await page.getByTestId('address-input').fill('Narva mnt 5, Tallinn');
    await emailInput.fill('anna.tamm@');
    // error is shown when the field loses focus
    await emailInput.blur();

    await expect(emailError).toBeVisible();
    await expect(emailError).toHaveText('Неверный формат email');
    await expect(emailInput).toHaveAttribute('aria-invalid', 'true');
    await expect(createOrderButton).toBeDisabled();

    // fixing the email hides the error and enables the button
    await emailInput.fill('anna.tamm@example.com');
    await expect(emailError).toBeHidden();
    await expect(createOrderButton).toBeEnabled();
  });
});
