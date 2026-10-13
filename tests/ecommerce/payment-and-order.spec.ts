// spec: test-plans/qapractice-ecommerce-core-operations.md
import { expect, test, type Page } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { PracticeSitesPage } from '../pages/PracticeSitesPage';
import { ProductListingPage } from '../pages/ProductListingPage';
import { CartPage } from '../pages/CartPage';
import { ShippingAddressPage } from '../pages/ShippingAddressPage';
import { PaymentPage } from '../pages/PaymentPage';
import { OrderConfirmationPage } from '../pages/OrderConfirmationPage';

async function openPaymentPage(page: Page): Promise<void> {
  const homePage = new HomePage(page);
  const practiceSitesPage = new PracticeSitesPage(page);
  const listing = new ProductListingPage(page);
  const cart = new CartPage(page);
  const shipping = new ShippingAddressPage(page);

  await homePage.open();
  await homePage.openPracticeSites();
  await practiceSitesPage.openEcommerce();
  await listing.addToCart('Laptop Pro');
  await listing.openCart();
  await cart.proceedToBuy();
  await expect(cart.dialog).toBeHidden();
  await shipping.fillAddress({
    name: 'Demo Shopper',
    street: '123 Demo Street',
    city: 'Testville',
    state: 'TS',
    zip: '12345',
  });
  await shipping.saveAddress();
}

test.describe('Core e-commerce user operations', () => {
  test('Require payment details before placing an order', async ({ page }) => {
    const payment = new PaymentPage(page);
    const confirmation = new OrderConfirmationPage(page);

    // Complete the cart and address steps, then verify payment form controls.
    await openPaymentPage(page);
    await expect(payment.heading).toBeVisible();
    await expect(payment.cardNumberField).toBeVisible();
    await expect(payment.expiryField).toBeVisible();
    await expect(payment.cvvField).toBeVisible();
    await expect(payment.buyNowButton).toBeVisible();

    // Submit blank payment fields and verify the order is not completed.
    await payment.submitPayment();
    await expect(payment.cardNumberError).toBeVisible();
    await expect(payment.expiryError).toBeVisible();
    await expect(payment.cvvError).toBeVisible();
    await expect(payment.heading).toBeVisible();
    await expect(confirmation.heading).toHaveCount(0);
    await expect(payment.cartButton).toHaveText('1');
  });

  test.fixme('Reject malformed non-empty payment details', async ({ page }) => {
    const payment = new PaymentPage(page);
    const confirmation = new OrderConfirmationPage(page);

    await openPaymentPage(page);
    await payment.fillPayment({ cardNumber: '123', expiry: '13/99', cvv: '1' });
    await payment.submitPayment();

    // The demo currently accepts malformed non-empty values and reports a successful order.
    await expect(payment.heading).toBeVisible();
    await expect(confirmation.heading).toHaveCount(0);
  });

  test('Place an order using synthetic demo payment data', async ({ page }) => {
    const payment = new PaymentPage(page);
    const confirmation = new OrderConfirmationPage(page);

    // Complete checkout with non-sensitive synthetic demo payment values.
    await openPaymentPage(page);
    await payment.fillPayment({
      cardNumber: '1234567890123456',
      expiry: '12/30',
      cvv: '123',
    });
    await payment.submitPayment();

    // Confirm that the order summary lists the purchased item and quantity.
    await expect(confirmation.heading).toBeVisible();
    await expect(confirmation.purchasedItem('Laptop Pro - $1200 x 1')).toBeVisible();
  });
});
