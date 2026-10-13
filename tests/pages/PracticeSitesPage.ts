import { type Page } from '@playwright/test';

export class PracticeSitesPage {
  constructor(private readonly page: Page) {}

  async openEcommerce(): Promise<void> {
    await this.page.getByRole('button', { name: 'Start practising →' }).nth(2).click();
  }
}