// spec: test-plans/qapractice-ecommerce-core-operations.md
import { expect, test } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { PracticeSitesPage } from '../pages/PracticeSitesPage';
import { ProductListingPage } from '../pages/ProductListingPage';
import { CartPage } from '../pages/CartPage';

test.describe('Core e-commerce user operations', () => {
  test('Review cart contents, totals, removal, and empty-cart behavior', async ({ page }) => {
    const homePage = new HomePage(page);
    const practiceSitesPage = new PracticeSitesPage(page);
    const listing = new ProductListingPage(page);
    const cart = new CartPage(page);

    // Open a fresh storefront session and confirm the cart starts empty.
    await homePage.open();
    await homePage.openPracticeSites();
    await practiceSitesPage.openEcommerce();
    await expect(listing.heading).toBeVisible();
    await expect(listing.cartButton).toHaveText('');
    await listing.openCart();
    await expect(cart.dialog).toContainText('Your cart is empty.');
    await expect(cart.total).toHaveText('Total: $0.00');
    await expect(cart.proceedToBuyButton).toBeDisabled();
    await cart.close();
    await expect(cart.dialog).toBeHidden();

    // Add selected quantities and verify both cart lines and total.
    await listing.setQuantity('Wireless Mouse', '2');
    await listing.addToCart('Wireless Mouse');
    await expect(listing.cartButton).toHaveText('2');
    await listing.setQuantity('Keyboard RGB', '1');
    await listing.addToCart('Keyboard RGB');
    await expect(listing.cartButton).toHaveText('3');
    await listing.openCart();
    await expect(cart.lineItem('Wireless Mouse')).toContainText('$25 x 2');
    await expect(cart.lineItem('Keyboard RGB')).toContainText('$80 x 1');
    await expect(cart.total).toHaveText('Total: $130.00');

    // Remove Wireless Mouse and verify the remaining line and updated total.
    await cart.removeItem('Wireless Mouse');
    await expect(cart.lineItem('Wireless Mouse')).toHaveCount(0);
    await expect(cart.lineItem('Keyboard RGB')).toContainText('$80 x 1');
    await expect(cart.total).toHaveText('Total: $80.00');

    // Remove the last item and confirm checkout is disabled for an empty cart.
    await cart.removeItem('Keyboard RGB');
    await expect(cart.dialog).toContainText('Your cart is empty.');
    await expect(cart.total).toHaveText('Total: $0.00');
    await expect(cart.proceedToBuyButton).toBeDisabled();
  });
});
