import { type Page } from '@playwright/test';

export class HomePage {
  constructor(private readonly page: Page) {}

  async open(): Promise<void> {
    await this.page.goto('https://www.qapractice.com/');
  }

  async openPracticeSites(): Promise<void> {
    await this.page.getByRole('link', { name: 'Practice Sites', exact: true }).click();
  }
}