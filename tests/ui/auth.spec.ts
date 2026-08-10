import { test, expect } from '../../fixtures/fixtures';
import { env } from '../../config/env';

test('Login as standard user', async ({ pages }) => {
    await pages.login.open();
    await pages.login.login(env.username, env.password);
    await pages.inventory.expectTitle('Products');
});

test('Log out', async ({ pages }) => {
    await pages.login.open();
    await pages.login.login(env.username, env.password);
    await pages.inventory.logout();
    await expect(pages.login.loginButton).toBeVisible();
});

test('Show error for locked out user', async ({ pages }) => {
    await pages.login.open();
    await pages.login.login(env.lockedOutUsername, env.password);
    await pages.login.expectError('Epic sadface: Sorry, this user has been locked out.');
});

test('Show error for invalid password', async ({ pages }) => {
    await pages.login.open();
    await pages.login.login(env.username, 'wrong_password');
    await pages.login.expectError('Username and password do not match any user in this service');
    await expect(pages.login.loginButton).toBeVisible();
});

test('Show error when credentials are empty', async ({ pages }) => {
    await pages.login.open();
    await pages.login.login('', '');

    await pages.login.expectError('Username is required');
    await expect(pages.login.loginButton).toBeVisible();
});

test('Prevent opening inventory page without login', async ({ pages, page }) => {
    await page.goto('/inventory.html');

    await expect(pages.login.loginButton).toBeVisible();
    await expect(pages.login.usernameInput).toBeVisible();
});
