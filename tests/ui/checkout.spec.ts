import { faker } from '@faker-js/faker';
import { test, expect } from '../../fixtures/fixtures';
import { env } from '../../config/env';
import { extractPdfText } from '../../helpers/utils';
import type { CustomerInfo } from '../../pages/CheckoutStepOnePage';

const checkoutItems = [
    'Sauce Labs Backpack',
    'Sauce Labs Bike Light',
    'Sauce Labs Bolt T-Shirt',
    'Sauce Labs Onesie',
];

function roundCurrency(amount: number) {
    return Number(amount.toFixed(2));
}

function createCustomerInfo(): CustomerInfo {
    return {
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        zipCode: faker.location.zipCode(),
    };
}

test.beforeEach('Login as standard user', async ({ pages }) => {
    await pages.login.open();
    await pages.login.login(env.username, env.password);
});

test('smoke test: Buy single item', async ({ pages, page }) => {
    await pages.inventory.expectCartToBeEmpty();
    await pages.inventory.addItemToCart('Sauce Labs Backpack');
    await pages.inventory.expectCartCount(1);

    await pages.inventory.gotoCart();
    await pages.cart.checkout();
    const customerInfo = createCustomerInfo();
    await pages.checkoutStepOne.enterCustomerInfo(customerInfo);

    await pages.checkoutStepTwo.expectTitle('Checkout: Overview');
    await pages.checkoutStepTwo.completeCheckout();
    await pages.checkoutComplete.expectTitle('Checkout: Complete!');
    await expect(page.getByRole('heading', { level: 2 })).toHaveText('Thank you for your order!');
    await pages.inventory.expectCartToBeEmpty();
    await pages.checkoutComplete.backHome();
    await pages.inventory.expectTitle('Products');
});

test('Cancel checkout from customer details step', async ({ pages }) => {
    await pages.inventory.addItemToCart('Sauce Labs Backpack');
    await pages.inventory.gotoCart();
    await pages.cart.checkout();
    await pages.checkoutStepOne.cancel();

    await pages.cart.expectTitle('Your Cart');
});

test('Checkout flow with four items and correct total amount', async ({ pages, page }) => {
    let expectedItemTotal = 0;
    for (const itemName of checkoutItems) {
        expectedItemTotal += await pages.inventory.getItemPrice(itemName);
        await pages.inventory.addItemToCart(itemName);
    }
    expectedItemTotal = roundCurrency(expectedItemTotal);

    await pages.inventory.gotoCart();
    await pages.cart.checkout();

    const customerInfo = createCustomerInfo();
    await pages.checkoutStepOne.enterCustomerInfo(customerInfo);

    await pages.checkoutStepTwo.expectTitle('Checkout: Overview');
    await pages.checkoutStepTwo.expectItemTotal(expectedItemTotal);
    await pages.checkoutStepTwo.completeCheckout();
    await pages.checkoutComplete.expectTitle('Checkout: Complete!');
    await expect(page.getByRole('heading', { level: 2 })).toHaveText('Thank you for your order!');
    await pages.checkoutComplete.expectCartToBeEmpty();
    await pages.checkoutComplete.backHome();
    await pages.inventory.expectTitle('Products');
});

test('Checkout requires first name', async ({ pages }) => {
    await pages.inventory.addItemToCart('Sauce Labs Backpack');
    await pages.inventory.gotoCart();
    await pages.cart.checkout();
    await pages.checkoutStepOne.enterCustomerInfo({
        firstName: '',
        lastName: faker.person.lastName(),
        zipCode: faker.location.zipCode(),
    });

    await pages.checkoutStepOne.expectError('First Name is required');
    await pages.checkoutStepOne.expectTitle('Checkout: Your Information');
});

test('Checkout requires postal code', async ({ pages }) => {
    await pages.inventory.addItemToCart('Sauce Labs Backpack');
    await pages.inventory.gotoCart();
    await pages.cart.checkout();
    await pages.checkoutStepOne.enterCustomerInfo({
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        zipCode: '',
    });

    await pages.checkoutStepOne.expectError('Postal Code is required');
    await pages.checkoutStepOne.expectTitle('Checkout: Your Information');
});

test('Recalculate total after removing item and complete checkout', async ({ pages, page }) => {
    const removedItemName = faker.helpers.arrayElement(checkoutItems);
    let initialItemTotal = 0;
    let removedItemPrice = 0;

    for (const itemName of checkoutItems) {
        const itemPrice = await pages.inventory.getItemPrice(itemName);
        initialItemTotal += itemPrice;
        if (itemName === removedItemName) {
            removedItemPrice = itemPrice;
        }
        await pages.inventory.addItemToCart(itemName);
    }

    initialItemTotal = roundCurrency(initialItemTotal);
    const updatedItemTotal = roundCurrency(initialItemTotal - removedItemPrice);

    await pages.inventory.gotoCart();
    await pages.cart.checkout();

    const customerInfo = createCustomerInfo();
    await pages.checkoutStepOne.enterCustomerInfo(customerInfo);
    await pages.checkoutStepTwo.expectTitle('Checkout: Overview');
    await pages.checkoutStepTwo.expectItemTotal(initialItemTotal);

    await pages.checkoutStepTwo.cancelCheckout();
    await pages.inventory.gotoCart();
    await pages.cart.removeItemFromCart(removedItemName);
    await pages.cart.checkout();
    await pages.checkoutStepOne.enterCustomerInfo(customerInfo);

    await pages.checkoutStepTwo.expectTitle('Checkout: Overview');
    await pages.checkoutStepTwo.expectItemTotal(updatedItemTotal);
    await pages.checkoutStepTwo.completeCheckout();
    await pages.checkoutComplete.expectTitle('Checkout: Complete!');
    await expect(page.getByRole('heading', { level: 2 })).toHaveText('Thank you for your order!');
});

test('Checkout button is disabled if cart is empty', async ({ pages }) => {
    test.fail(true, 'BUG-1001: Checkout is enabled when cart is empty');
    await pages.inventory.expectCartToBeEmpty();
    await pages.inventory.gotoCart();
    await pages.cart.expectCheckoutToBeDisabled();
});

test('Removing the last item clears the cart badge and disables checkout', async ({ pages }) => {
    test.fail(true, 'BUG-1001: Checkout is enabled when cart is empty');
    await pages.inventory.addItemToCart(checkoutItems[0]);
    await pages.inventory.gotoCart();
    await pages.cart.expectCheckoutToBeEnabled();
    await pages.cart.expectCartCount(1);

    await pages.cart.removeItemFromCart(checkoutItems[0]);
    await pages.cart.expectCartToBeEmpty();
    await pages.cart.expectCheckoutToBeDisabled();
});

test('Buy three items and validate generated PDF order content', async ({
    pages,
    page,
}, testInfo) => {
    const orderedItems = faker.helpers.arrayElements(checkoutItems, 3);
    let expectedItemTotal = 0;
    for (const itemName of orderedItems) {
        expectedItemTotal += await pages.inventory.getItemPrice(itemName);
        await pages.inventory.addItemToCart(itemName);
    }
    expectedItemTotal = roundCurrency(expectedItemTotal);

    await pages.inventory.gotoCart();
    await pages.cart.checkout();
    const customerInfo = createCustomerInfo();
    await pages.checkoutStepOne.enterCustomerInfo(customerInfo);
    await pages.checkoutStepTwo.completeCheckout();

    const [download] = await Promise.all([
        page.waitForEvent('download'),
        pages.checkoutComplete.generatePdfOrder(),
    ]);

    const pdfText = await extractPdfText(download, testInfo);
    const todayDate = new Intl.DateTimeFormat('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
    }).format(new Date());

    expect(pdfText).toContain('Order Receipt');
    expect(pdfText).toContain(todayDate);
    expect(pdfText).toContain(`${customerInfo.firstName} ${customerInfo.lastName}`);
    expect(pdfText).toContain(customerInfo.zipCode);
    for (const itemName of orderedItems) {
        expect(pdfText).toContain(itemName);
    }
    expect(pdfText).toContain(`Item total $${expectedItemTotal.toFixed(2)}`);
});
