import { Page, Locator, expect } from '@playwright/test';
import { BaseAuthenticatedPage } from './BaseAuthenticatedPage';

export type SortOrder = 'az' | 'za' | 'lohi' | 'hilo';
export type InventoryItem = {
    name: string;
    price: number;
};

export class InventoryPage extends BaseAuthenticatedPage {
    readonly inventoryItems: Locator;
    readonly sortSelect: Locator;

    constructor(page: Page) {
        super(page);
        this.inventoryItems = this.page.getByTestId('inventory-item');
        this.sortSelect = this.page.getByTestId('product-sort-container');
    }

    private inventoryItem(itemName: string) {
        return this.inventoryItems.filter({ hasText: itemName });
    }

    async getAllItems(): Promise<InventoryItem[]> {
        const itemsData: InventoryItem[] = [];
        for (let i = 0; i < (await this.inventoryItems.count()); i++) {
            const name = await this.inventoryItems
                .nth(i)
                .getByTestId('inventory-item-name')
                .innerText();
            const price = await this.getItemPrice(name);

            itemsData.push({ name, price });
        }
        return itemsData;
    }

    async sortItems(sortOrder: SortOrder) {
        await this.sortSelect.selectOption(sortOrder);
    }

    async addItemToCart(itemName: string) {
        await this.inventoryItem(itemName).getByRole('button', { name: 'Add to cart' }).click();
    }

    async removeItemFromCart(itemName: string) {
        await this.inventoryItem(itemName).getByRole('button', { name: 'Remove' }).click();
    }

    async getItemPrice(itemName: string) {
        const priceLocator = this.inventoryItem(itemName).getByTestId('inventory-item-price');
        await expect(priceLocator).toHaveText(/^\$\d+(?:\.\d{2})$/);

        const priceText = await priceLocator.textContent();
        if (priceText === null) {
            throw new Error(`Price text for "${itemName}" is not defined`);
        }

        const parsedPrice = Number.parseFloat(priceText.slice(1));
        if (Number.isNaN(parsedPrice)) {
            throw new Error(`Price for "${itemName}" is not a valid number: "${priceText}"`);
        }

        return parsedPrice;
    }

    async openItemDetails(itemName: string) {
        await this.inventoryItem(itemName).getByTestId('inventory-item-name').click();
    }
}
