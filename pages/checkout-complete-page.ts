import { Page, Locator } from '@playwright/test';
import { BaseAuthenticatedPage } from './base-authenticated-page';

export class CheckoutCompletePage extends BaseAuthenticatedPage {
    readonly homeButton: Locator;
    readonly generatePdfOrderButton: Locator;

    constructor(page: Page) {
        super(page);
        this.homeButton = this.page.getByRole('button', { name: 'Back Home' });
        this.generatePdfOrderButton = this.page.getByRole('button', { name: 'Generate PDF order' });
    }

    async backHome() {
        await this.homeButton.click();
    }

    async generatePdfOrder() {
        await this.generatePdfOrderButton.click();
    }
}
