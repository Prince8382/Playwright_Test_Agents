import { type Locator, type Page } from '@playwright/test';

export interface PaymentDetails {
  cardNumber: string;
  expiry: string;
  cvv: string;
}

export class PaymentPage {
  constructor(private readonly page: Page) {}

  get heading(): Locator {
    return this.page.getByRole('heading', { name: 'Payment Details', exact: true });
  }

  get cardNumberField(): Locator {
    return this.page.getByTestId('ecom-card-number');
  }

  get expiryField(): Locator {
    return this.page.getByTestId('ecom-expiry');
  }

  get cvvField(): Locator {
    return this.page.getByTestId('ecom-cvv');
  }

  get buyNowButton(): Locator {
    return this.page.getByTestId('ecom-buy-now');
  }

  get cartButton(): Locator {
    return this.page.getByTestId('ecom-cart-button');
  }

  get cardNumberError(): Locator {
    return this.page.getByText('Please enter card number.', { exact: true });
  }

  get expiryError(): Locator {
    return this.page.getByText('Please enter expiry date.', { exact: true });
  }

  get cvvError(): Locator {
    return this.page.getByText('Please enter CVV.', { exact: true });
  }

  async fillPayment(details: PaymentDetails): Promise<void> {
    await this.cardNumberField.fill(details.cardNumber);
    await this.expiryField.fill(details.expiry);
    await this.cvvField.fill(details.cvv);
  }

  async submitPayment(): Promise<void> {
    await this.buyNowButton.click();
  }
}