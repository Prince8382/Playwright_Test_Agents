import { type Locator, type Page } from '@playwright/test';

export class CartPage {
  constructor(private readonly page: Page) {}

  get dialog(): Locator {
    return this.page.getByRole('dialog');
  }

  get total(): Locator {
    return this.dialog.getByText(/Total: \$/);
  }

  get proceedToBuyButton(): Locator {
    return this.dialog.getByRole('button', { name: 'Proceed to Buy', exact: true });
  }

  lineItem(productName: string): Locator {
    return this.dialog.getByText(new RegExp(`${this.escapeRegExp(productName)} - \\$`));
  }

  async open(): Promise<void> {
    await this.page.getByTestId('ecom-cart-button').click();
  }

  async close(): Promise<void> {
    await this.dialog.getByRole('button', { name: 'Close', exact: true }).click();
  }

  async removeItem(productName: string): Promise<void> {
    await this.lineItem(productName).locator('..').getByRole('button', { name: 'Remove', exact: true }).click();
  }

  async proceedToBuy(): Promise<void> {
    await this.proceedToBuyButton.click();
  }

  private escapeRegExp(value: string): string {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
}