// spec: test-plans/qapractice-ecommerce-core-operations.md
import { expect, test } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { PracticeSitesPage } from '../pages/PracticeSitesPage';
import { ProductListingPage } from '../pages/ProductListingPage';
import { CartPage } from '../pages/CartPage';
import { ShippingAddressPage } from '../pages/ShippingAddressPage';
import { PaymentPage } from '../pages/PaymentPage';

test.describe('Core e-commerce user operations', () => {
  test('Enter and validate a shipping address', async ({ page }) => {
    const homePage = new HomePage(page);
    const practiceSitesPage = new PracticeSitesPage(page);
    const listing = new ProductListingPage(page);
    const cart = new CartPage(page);
    const shipping = new ShippingAddressPage(page);
    const payment = new PaymentPage(page);

    // Start fresh, add an item, and open the shipping-address form.
    await homePage.open();
    await homePage.openPracticeSites();
    await practiceSitesPage.openEcommerce();
    await listing.addToCart('Laptop Pro');
    await listing.openCart();
    await cart.proceedToBuy();
    await expect(cart.dialog).toBeHidden();
    await expect(shipping.heading).toBeVisible();
    await expect(shipping.nameField).toBeVisible();
    await expect(shipping.streetField).toBeVisible();
    await expect(shipping.cityField).toBeVisible();
    await expect(shipping.stateField).toBeVisible();
    await expect(shipping.zipField).toBeVisible();
    await expect(shipping.saveButton).toBeVisible();

    // Submit an empty address and verify validation prevents advancement.
    const alertPromise = page.waitForEvent('dialog').then(async (alert) => {
      expect(alert.message()).toBe('Please fill in all address fields.');
      await alert.accept();
    });
    await shipping.saveAddress();
    await alertPromise;
    await expect(shipping.heading).toBeVisible();
    await expect(payment.heading).toHaveCount(0);

    // Enter dummy address details and verify checkout advances to payment.
    await shipping.fillAddress({
      name: 'Demo Shopper',
      street: '123 Demo Street',
      city: 'Testville',
      state: 'TS',
      zip: '12345',
    });
    await shipping.saveAddress();
    await expect(payment.heading).toBeVisible();
    await expect(payment.cardNumberField).toBeVisible();
    await expect(payment.expiryField).toBeVisible();
    await expect(payment.cvvField).toBeVisible();
    await expect(payment.buyNowButton).toBeVisible();
  });
});
