import { Page, Locator, expect } from '@playwright/test';

export class BaseAuthenticatedPage {
    readonly page: Page;
    readonly openMenuButton: Locator;
    readonly closeMenuButton: Locator;
    readonly logoutMenuItem: Locator;
    readonly cartBadge: Locator;
    readonly cartLink: Locator;
    readonly titleLabel: Locator;

    constructor(page: Page) {
        this.page = page;
        this.openMenuButton = this.page.locator('#react-burger-menu-btn');
        this.closeMenuButton = this.page.locator('#react-burger-cross-btn');
        this.logoutMenuItem = this.page.getByRole('button', { name: 'Logout' });
        this.cartBadge = this.page.getByTestId('shopping-cart-badge');
        this.cartLink = this.page.getByTestId('shopping-cart-link');
        this.titleLabel = this.page.getByTestId('title');
    }

    async openMenu() {
        if (await this.logoutMenuItem.isHidden()) {
            await this.openMenuButton.click();
            await expect(this.logoutMenuItem).toBeVisible();
        }
    }

    async closeMenu() {
        if (await this.logoutMenuItem.isVisible()) {
            await this.closeMenuButton.click();
            await expect(this.logoutMenuItem).toBeHidden();
        }
    }

    async gotoCart() {
        await this.cartLink.click();
    }

    async expectCartCount(count: number) {
        await expect(this.cartBadge).toHaveText(String(count));
    }

    async expectCartToBeEmpty() {
        await expect(this.cartBadge).toBeHidden();
    }

    async expectTitle(title: string) {
        await expect(this.titleLabel).toHaveText(title);
    }

    async logout() {
        await this.openMenu();
        await this.logoutMenuItem.click();
    }
}
