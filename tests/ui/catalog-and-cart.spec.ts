import { test, expect } from '../../fixtures/fixtures';
import { env } from '../../config/env';
import type { SortOrder, InventoryItem } from '../../pages/inventory-page';

const sortOrders: SortOrder[] = ['az', 'za', 'hilo', 'lohi'];

function getItemsInExpectedOrder(
    actualItems: InventoryItem[],
    sortOrder: SortOrder,
): InventoryItem[] {
    switch (sortOrder) {
        case 'az':
            return actualItems.toSorted((a, b) => a.name.localeCompare(b.name));
        case 'za':
            return actualItems.toSorted((a, b) => b.name.localeCompare(a.name));
        case 'lohi':
            return actualItems.toSorted((a, b) => a.price - b.price);
        case 'hilo':
            return actualItems.toSorted((a, b) => b.price - a.price);
    }
}

test.beforeEach('Login as standard user', async ({ pages }) => {
    await pages.login.open();
    await pages.login.login(env.username, env.password);
});

test('Add multiple products to cart', async ({ pages }) => {
    await pages.inventory.addItemToCart('Sauce Labs Backpack');
    await pages.inventory.addItemToCart('Sauce Labs Bike Light');

    await pages.inventory.expectCartCount(2);
});

test('Remove one item keeps remaining cart count', async ({ pages }) => {
    await pages.inventory.addItemToCart('Sauce Labs Backpack');
    await pages.inventory.addItemToCart('Sauce Labs Bike Light');
    await pages.inventory.removeItemFromCart('Sauce Labs Bike Light');
    await pages.inventory.expectCartCount(1);
    await pages.inventory.removeItemFromCart('Sauce Labs Backpack');
    await pages.inventory.expectCartToBeEmpty();
});

test('Add product from item details page', async ({ pages }) => {
    await pages.inventory.openItemDetails('Sauce Labs Backpack');
    await pages.inventoryItem.expectOnItemDetailsPage();
    await pages.inventoryItem.addItemToCart();
    await pages.inventoryItem.expectCartCount(1);
    await pages.inventoryItem.backToProducts();

    await pages.inventory.expectTitle('Products');
    await pages.inventory.expectCartCount(1);
});

test('Selected items are visible in cart', async ({ pages, page }) => {
    const selectedItems = ['Sauce Labs Backpack', 'Sauce Labs Bolt T-Shirt'];
    for (const itemName of selectedItems) {
        await pages.inventory.addItemToCart(itemName);
    }

    await pages.inventory.gotoCart();
    await pages.cart.expectTitle('Your Cart');
    await pages.cart.expectItemsInCart(selectedItems);
    // ensure the cart content is still fine after page reload
    await page.reload();
    await pages.cart.expectItemsInCart(selectedItems);
});

test('Continue shopping from cart', async ({ pages }) => {
    await pages.inventory.addItemToCart('Sauce Labs Backpack');
    await pages.inventory.gotoCart();
    await pages.cart.continueShopping();

    await pages.inventory.expectTitle('Products');
    await pages.inventory.expectCartCount(1);
});

for (const sortOrder of sortOrders) {
    test(`Inventory items are sorted correctly by ${sortOrder}`, async ({ pages }) => {
        await pages.inventory.sortItems(sortOrder);
        const actualItems = await pages.inventory.getAllItems();
        const expectedItems = getItemsInExpectedOrder(actualItems, sortOrder);
        expect(actualItems).toEqual(expectedItems);
    });
}
