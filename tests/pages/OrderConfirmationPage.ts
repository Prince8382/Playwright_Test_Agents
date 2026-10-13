import { type Locator, type Page } from '@playwright/test';

export class OrderConfirmationPage {
  constructor(private readonly page: Page) {}

  get heading(): Locator {
    return this.page.getByRole('heading', { name: 'Order Successful!', exact: true });
  }

  purchasedItem(itemText: string): Locator {
    return this.page.getByText(itemText, { exact: true });
  }
}