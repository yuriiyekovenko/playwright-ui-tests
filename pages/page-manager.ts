import { Page } from '@playwright/test';
import { LoginPage } from './login-page';
import { InventoryPage } from './inventory-page';
import { InventoryItemPage } from './inventory-item-page';
import { CartPage } from './cart-page';
import { CheckoutStepOnePage } from './checkout-step-one-page';
import { CheckoutStepTwoPage } from './checkout-step-two-page';
import { CheckoutCompletePage } from './checkout-complete-page';

export class PageManager {
    private _login?: LoginPage;
    private _inventory?: InventoryPage;
    private _inventoryItem?: InventoryItemPage;
    private _cart?: CartPage;
    private _checkoutStepOne?: CheckoutStepOnePage;
    private _checkoutStepTwo?: CheckoutStepTwoPage;
    private _checkoutComplete?: CheckoutCompletePage;

    constructor(private page: Page) {}

    get login(): LoginPage {
        return (this._login ??= new LoginPage(this.page));
    }

    get inventory(): InventoryPage {
        return (this._inventory ??= new InventoryPage(this.page));
    }

    get inventoryItem(): InventoryItemPage {
        return (this._inventoryItem ??= new InventoryItemPage(this.page));
    }

    get cart(): CartPage {
        return (this._cart ??= new CartPage(this.page));
    }

    get checkoutStepOne(): CheckoutStepOnePage {
        return (this._checkoutStepOne ??= new CheckoutStepOnePage(this.page));
    }

    get checkoutStepTwo(): CheckoutStepTwoPage {
        return (this._checkoutStepTwo ??= new CheckoutStepTwoPage(this.page));
    }

    get checkoutComplete(): CheckoutCompletePage {
        return (this._checkoutComplete ??= new CheckoutCompletePage(this.page));
    }
}
