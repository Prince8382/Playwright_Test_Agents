import { type Locator, type Page } from '@playwright/test';

export class ProductDetailsPage {
  constructor(private readonly page: Page) {}

  get backToProductsButton(): Locator {
    return this.page.getByTestId('ecom-back-to-products');
  }

  get description(): Locator {
    return this.page.getByText(/A powerful 16-inch laptop/);
  }

  name(productName: string): Locator {
    return this.page.getByRole('heading', { name: productName, exact: true });
  }

  category(categoryName: string): Locator {
    return this.page.getByText(categoryName, { exact: true });
  }

  brand(brandName: string): Locator {
    return this.page.getByText(`by ${brandName}`, { exact: true });
  }

  rating(ratingText: string): Locator {
    return this.page.getByText(ratingText, { exact: true });
  }

  price(priceText: string): Locator {
    return this.page.getByText(priceText, { exact: true });
  }

  quantity(productName: string): Locator {
    return this.page.getByTestId(`quantity-${this.productId(productName)}`);
  }

  addButton(productName: string): Locator {
    return this.page.getByTestId(`add-to-cart-${this.productId(productName)}`);
  }

  async setQuantity(productName: string, quantity: string): Promise<void> {
    await this.quantity(productName).fill(quantity);
  }

  async addToCart(productName: string): Promise<void> {
    await this.addButton(productName).click();
  }

  async backToProducts(): Promise<void> {
    await this.backToProductsButton.click();
  }

  private productId(productName: string): number {
    if (productName !== 'Laptop Pro') {
      throw new Error(`Unsupported product detail quantity control: ${productName}`);
    }
    return 1;
  }
}