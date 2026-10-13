import { type Locator, type Page } from '@playwright/test';

export interface ShippingAddress {
  name: string;
  street: string;
  city: string;
  state: string;
  zip: string;
}

export class ShippingAddressPage {
  constructor(private readonly page: Page) {}

  get heading(): Locator {
    return this.page.getByRole('heading', { name: 'Shipping Address', exact: true });
  }

  get nameField(): Locator {
    return this.page.getByTestId('ecom-address-name');
  }

  get streetField(): Locator {
    return this.page.getByTestId('ecom-address-street');
  }

  get cityField(): Locator {
    return this.page.getByTestId('ecom-address-city');
  }

  get stateField(): Locator {
    return this.page.getByTestId('ecom-address-state');
  }

  get zipField(): Locator {
    return this.page.getByTestId('ecom-address-zip');
  }

  get saveButton(): Locator {
    return this.page.getByTestId('ecom-save-address');
  }

  async fillAddress(address: ShippingAddress): Promise<void> {
    await this.nameField.fill(address.name);
    await this.streetField.fill(address.street);
    await this.cityField.fill(address.city);
    await this.stateField.fill(address.state);
    await this.zipField.fill(address.zip);
  }

  async saveAddress(): Promise<void> {
    await this.saveButton.click();
  }
}