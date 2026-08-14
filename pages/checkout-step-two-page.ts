import { Page, Locator, expect } from '@playwright/test';
import { BaseAuthenticatedPage } from './base-authenticated-page';

export class CheckoutStepTwoPage extends BaseAuthenticatedPage {
    readonly finishButton: Locator;
    readonly cancelButton: Locator;
    readonly itemTotalLabel: Locator;

    constructor(page: Page) {
        super(page);
        this.finishButton = this.page.getByRole('button', { name: 'Finish' });
        this.cancelButton = this.page.getByRole('button', { name: 'Cancel' });
        this.itemTotalLabel = this.page.getByTestId('subtotal-label');
    }

    async completeCheckout() {
        await this.finishButton.click();
    }

    async cancelCheckout() {
        await this.cancelButton.click();
    }

    async expectItemTotal(amount: number) {
        await expect(this.itemTotalLabel).toHaveText(`Item total: $${amount.toFixed(2)}`);
    }
}
