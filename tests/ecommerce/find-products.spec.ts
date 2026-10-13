// spec: test-plans/qapractice-ecommerce-core-operations.md
import { expect, test } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { PracticeSitesPage } from '../pages/PracticeSitesPage';
import { ProductListingPage } from '../pages/ProductListingPage';

test.describe('Core e-commerce user operations', () => {
  test('Find products using search, category, sort, and pagination', async ({ page }) => {
    const homePage = new HomePage(page);
    const practiceSitesPage = new PracticeSitesPage(page);
    const listing = new ProductListingPage(page);

    // Open the storefront from the practice-site catalog.
    await homePage.open();
    await homePage.openPracticeSites();
    await practiceSitesPage.openEcommerce();
    await expect(listing.heading).toBeVisible();
    await expect(listing.searchField).toBeVisible();
    for (const category of ['All', 'Electronics', 'Fashion', 'Beauty', 'Beverages']) {
      await expect(listing.categoryButton(category)).toBeVisible();
    }
    await expect(listing.sortSelector).toBeVisible();
    await expect(listing.pagination).toBeVisible();

    // Search for mouse and verify only the matching product is listed.
    await listing.search('mouse');
    await expect(listing.resultCount).toHaveText('1 product');
    await expect(listing.productImage('Wireless Mouse')).toBeVisible();
    await expect(listing.productCards).toHaveCount(1);

    // Clear search and filter by Fashion.
    await listing.search('');
    await listing.selectCategory('Fashion');
    await expect(listing.resultCount).toHaveText('3 products in Fashion');
    for (const product of ['Gold Zipper Bag', 'Premium Ladies Purse', 'Ladies Shoes']) {
      await expect(listing.productImage(product)).toBeVisible();
    }
    await expect(listing.productCards).toHaveCount(3);

    // Sort all products from low to high price and verify visible ordering.
    await listing.selectCategory('All');
    await listing.sortBy('price-asc');
    const prices = await listing.visibleProductPrices();
    expect(prices).toHaveLength(8);
    expect(prices).toEqual([...prices].sort((a, b) => a - b));
    await expect(listing.productCards.first()).toContainText('Coca Cola 250ml');

    // Open page 2 and return to page 1.
    await listing.goToPage(2);
    await expect(listing.productCards.first()).toContainText('Premium Earphone');
    await expect(listing.productImage('Coca Cola 250ml')).toHaveCount(0);
    await expect(listing.previousPageButton).toBeEnabled();
    await listing.goToPreviousPage();
    await expect(listing.productCards.first()).toContainText('Coca Cola 250ml');
    await expect(listing.previousPageButton).toBeDisabled();

    // Verify an unmatched search displays an empty state and clearing restores products.
    await listing.search('no-such-product-xyz');
    await expect(listing.resultCount).toHaveText('0 products');
    await expect(listing.emptySearchMessage).toContainText('No products found');
    await expect(listing.productCards).toHaveCount(0);
    await listing.search('');
    await expect(listing.resultCount).toHaveText('20 products');
    await expect(listing.productCards).toHaveCount(8);
    await expect(listing.productCards.first()).toContainText('Coca Cola 250ml');
  });
});
