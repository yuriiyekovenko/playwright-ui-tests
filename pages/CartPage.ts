import { Page, Locator, expect } from '@playwright/test';
import { BaseAuthenticatedPage } from './BaseAuthenticatedPage';

export class CartPage extends BaseAuthenticatedPage {
    readonly checkoutButton: Locator;
    readonly continueShoppingButton: Locator;

    constructor(page: Page) {
        super(page);
        this.checkoutButton = this.page.getByRole('button', { name: 'Checkout' });
        this.continueShoppingButton = this.page.getByRole('button', { name: 'Continue Shopping' });
    }

    private cartItem(itemName: string) {
        return this.page.getByTestId('inventory-item').filter({ hasText: itemName });
    }

    async checkout() {
        await this.checkoutButton.click();
    }

    async removeItemFromCart(itemName: string) {
        await this.cartItem(itemName).getByRole('button', { name: 'Remove' }).click();
    }

    async continueShopping() {
        await this.continueShoppingButton.click();
    }

    async expectCheckoutToBeDisabled() {
        await expect(this.checkoutButton).toBeDisabled();
    }

    async expectCheckoutToBeEnabled() {
        await expect(this.checkoutButton).toBeEnabled();
    }

    async expectItemInCart(itemName: string) {
        await expect(this.cartItem(itemName)).toBeVisible();
    }

    async expectItemsInCart(itemNames: string[]) {
        for (const itemName of itemNames) {
            await this.expectItemInCart(itemName);
        }
    }
}
