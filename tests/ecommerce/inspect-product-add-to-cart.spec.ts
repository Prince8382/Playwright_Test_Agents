// spec: test-plans/qapractice-ecommerce-core-operations.md
import { expect, test } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { PracticeSitesPage } from '../pages/PracticeSitesPage';
import { ProductListingPage } from '../pages/ProductListingPage';
import { ProductDetailsPage } from '../pages/ProductDetailsPage';

test.describe('Core e-commerce user operations', () => {
  test('Inspect a product and add a chosen quantity', async ({ page }) => {
    const homePage = new HomePage(page);
    const practiceSitesPage = new PracticeSitesPage(page);
    const listing = new ProductListingPage(page);
    const details = new ProductDetailsPage(page);

    // Open the storefront and verify the cart is empty.
    await homePage.open();
    await homePage.openPracticeSites();
    await practiceSitesPage.openEcommerce();
    await expect(listing.heading).toBeVisible();
    await expect(listing.cartButton).toHaveText('');

    // Inspect Laptop Pro details and purchase controls.
    await listing.openProduct('Laptop Pro');
    await expect(details.backToProductsButton).toBeVisible();
    await expect(details.name('Laptop Pro')).toBeVisible();
    await expect(details.category('Electronics')).toBeVisible();
    await expect(details.brand('ProTech')).toBeVisible();
    await expect(details.rating('4.6 (1,284)')).toBeVisible();
    await expect(details.price('$1200')).toBeVisible();
    await expect(details.description).toBeVisible();
    await expect(details.quantity('Laptop Pro')).toHaveAttribute('min', '1');
    await expect(details.addButton('Laptop Pro')).toBeVisible();

    // Add two units and verify the cart count and selected product.
    await details.setQuantity('Laptop Pro', '2');
    await details.addToCart('Laptop Pro');
    await expect(listing.cartButton).toHaveText('2');
    await expect(details.name('Laptop Pro')).toBeVisible();

    // Return to the listing and confirm a below-minimum quantity adds no units.
    await details.backToProducts();
    await expect(listing.quantity('Laptop Pro')).toHaveAttribute('min', '1');
    await listing.setQuantity('Laptop Pro', '0');
    await listing.addToCart('Laptop Pro');
    await expect(listing.cartButton).toHaveText('2');
  });
});
