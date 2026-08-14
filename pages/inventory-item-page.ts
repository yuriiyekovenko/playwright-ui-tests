import { Page, Locator, expect } from '@playwright/test';
import { BaseAuthenticatedPage } from './base-authenticated-page';

export class InventoryItemPage extends BaseAuthenticatedPage {
    readonly addToCartButton: Locator;
    readonly removeButton: Locator;
    readonly backToProductsButton: Locator;

    constructor(page: Page) {
        super(page);
        this.addToCartButton = this.page.getByRole('button', { name: 'Add to cart' });
        this.removeButton = this.page.getByRole('button', { name: 'Remove' });
        this.backToProductsButton = this.page.getByRole('button', { name: 'Back to products' });
    }

    async addItemToCart() {
        await this.addToCartButton.click();
    }

    async expectOnItemDetailsPage() {
        await expect(this.page).toHaveURL(/inventory-item\.html\?id=\d+$/);
    }

    async removeItemFromCart() {
        await this.removeButton.click();
    }

    async backToProducts() {
        await this.backToProductsButton.click();
    }
}
