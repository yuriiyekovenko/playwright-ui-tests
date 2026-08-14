import { Page, Locator, expect } from '@playwright/test';
import { BaseAuthenticatedPage } from './base-authenticated-page';

export type CustomerInfo = {
    firstName: string;
    lastName: string;
    zipCode: string;
};

export class CheckoutStepOnePage extends BaseAuthenticatedPage {
    readonly firstNameInput: Locator;
    readonly lastNameInput: Locator;
    readonly zipInput: Locator;
    readonly continueButton: Locator;
    readonly cancelButton: Locator;
    readonly errorMessage: Locator;

    constructor(page: Page) {
        super(page);
        this.firstNameInput = this.page.getByPlaceholder('First Name');
        this.lastNameInput = this.page.getByPlaceholder('Last Name');
        this.zipInput = this.page.getByPlaceholder('Zip/Postal Code');
        this.continueButton = this.page.getByRole('button', { name: 'Continue' });
        this.cancelButton = this.page.getByRole('button', { name: 'Cancel' });
        this.errorMessage = this.page.getByTestId('error');
    }

    async fillCustomerInfo(firstName: string, lastName: string, zip: string) {
        await this.firstNameInput.fill(firstName);
        await this.lastNameInput.fill(lastName);
        await this.zipInput.fill(zip);
    }

    async continueCheckout() {
        await this.continueButton.click();
    }

    async enterCustomerInfo(customerInfo: CustomerInfo) {
        await this.fillCustomerInfo(
            customerInfo.firstName,
            customerInfo.lastName,
            customerInfo.zipCode,
        );
        await this.continueCheckout();
    }

    async cancel() {
        await this.cancelButton.click();
    }

    async expectError(message: string) {
        await expect(this.errorMessage).toContainText(message);
    }
}
