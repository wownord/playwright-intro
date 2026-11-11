import { test, expect } from '@playwright/test';

const checkoutPageUrl = 'https://shop.tl-academy.ee/checkout';

test.describe('Checkout page: payment and delivery', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(checkoutPageUrl);
  });

  test('TL-16-4 place order button test with delivery check + validation', async ({ page }) => {
    const emailInput = page.getByTestId('email-input');
    const nameInput = page.getByTestId('name-input');
    const placeOrderButton = page.getByTestId('place-order-button');

    // initial state: button disabled, parcel locker selected
    await expect(placeOrderButton).toBeDisabled();
    await expect(page.getByTestId('delivery-parcel-locker-radio')).toBeChecked();
    await expect(page.getByTestId('summary-delivery')).toHaveText('€3.99');
    await expect(page.getByTestId('summary-total')).toHaveText('€82.99');

    // delivery check: home delivery changes delivery price and total
    await page.getByTestId('delivery-home-option').click();
    await expect(page.getByTestId('delivery-home-radio')).toBeChecked();
    await expect(page.getByTestId('summary-delivery')).toHaveText('€5.99');
    await expect(page.getByTestId('summary-total')).toHaveText('€84.99');

    // validation: invalid email and name without last name
    await emailInput.fill('anna.tamm@example');
    await emailInput.blur();
    await nameInput.fill('Anna');
    await nameInput.blur();

    await expect(page.getByTestId('email-error')).toHaveText('Enter a valid email address');
    await expect(page.getByTestId('name-error')).toHaveText(
      'Enter your first and last name separated by a space, for example Anna Tamm',
    );
    await expect(placeOrderButton).toBeDisabled();

    // valid data: errors disappear and button becomes enabled
    await emailInput.fill('anna.tamm@example.com');
    await nameInput.fill('Anna Tamm');
    await expect(page.getByTestId('email-error')).toBeEmpty();
    await expect(page.getByTestId('name-error')).toBeEmpty();
    await expect(placeOrderButton).toBeEnabled();

    // place order: confirmation with spinner, button disabled while placing
    await placeOrderButton.click();
    await expect(page.getByTestId('order-message')).toHaveText('Order placed. Thank you!');
    await expect(page.getByTestId('order-spinner')).toBeVisible();
    await expect(placeOrderButton).toBeDisabled();
  });
});
