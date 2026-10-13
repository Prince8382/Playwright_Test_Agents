import { type Locator, type Page } from '@playwright/test';

const productIds: Record<string, number> = {
  'Laptop Pro': 1,
  'Wireless Mouse': 2,
  'Keyboard RGB': 3,
  'Headphones Noise Cancelling': 4,
  'External SSD 1TB': 5,
  'Monitor 4K': 6,
  'Coca Cola 250ml': 7,
  'Mango Drink': 8,
};

export class ProductListingPage {
  constructor(private readonly page: Page) {}

  get heading(): Locator {
    return this.page.getByRole('heading', { name: 'E-commerce Automation Practice', exact: true });
  }

  get searchField(): Locator {
    return this.page.getByRole('searchbox', { name: 'Search' });
  }

  get sortSelector(): Locator {
    return this.page.getByRole('combobox', { name: 'Sort by' });
  }

  get pagination(): Locator {
    return this.page.getByRole('navigation', { name: 'Product pages' });
  }

  get resultCount(): Locator {
    return this.page.getByTestId('ecom-result-count');
  }

  get productCards(): Locator {
    return this.page.locator('[data-testid^="product-card-"]');
  }

  get cartButton(): Locator {
    return this.page.getByTestId('ecom-cart-button');
  }

  get previousPageButton(): Locator {
    return this.page.getByTestId('ecom-page-prev');
  }

  get emptySearchMessage(): Locator {
    return this.page.getByTestId('ecom-no-results');
  }

  categoryButton(category: string): Locator {
    return this.page.getByRole('button', { name: category, exact: true });
  }

  productImage(productName: string): Locator {
    return this.page.getByRole('img', { name: productName, exact: true });
  }

  quantity(productName: string): Locator {
    return this.page.getByTestId(`quantity-${this.productId(productName)}`);
  }

  async search(query: string): Promise<void> {
    await this.searchField.fill(query);
  }

  async selectCategory(category: string): Promise<void> {
    await this.categoryButton(category).click();
  }

  async sortBy(option: string): Promise<void> {
    await this.sortSelector.selectOption(option);
  }

  async goToPage(pageNumber: number): Promise<void> {
    await this.page.getByTestId(`ecom-page-${pageNumber}`).click();
  }

  async goToPreviousPage(): Promise<void> {
    await this.previousPageButton.click();
  }

  async openProduct(productName: string): Promise<void> {
    await this.productImage(productName).click();
  }

  async openCart(): Promise<void> {
    await this.cartButton.click();
  }

  async setQuantity(productName: string, quantity: string): Promise<void> {
    await this.quantity(productName).fill(quantity);
  }

  async addToCart(productName: string): Promise<void> {
    await this.page.getByTestId(`add-to-cart-${this.productId(productName)}`).click();
  }

  async visibleProductPrices(): Promise<number[]> {
    const cardTexts = await this.productCards.allTextContents();
    return cardTexts.map((text) => {
      const price = text.match(/\$(\d+(?:\.\d{1,2})?)/)?.[1];
      if (!price) {
        throw new Error(`Could not find a price in product card: ${text}`);
      }
      return Number(price);
    });
  }

  private productId(productName: string): number {
    const id = productIds[productName];
    if (id === undefined) {
      throw new Error(`Unsupported product: ${productName}`);
    }
    return id;
  }
}