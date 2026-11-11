import { test as base } from '@playwright/test';
import { PageManager } from '../pages/page-manager';

export { expect } from '@playwright/test';

type TestFixtures = {
    pages: PageManager;
};

export const test = base.extend<TestFixtures>({
    pages: async ({ page }, use) => {
        await use(new PageManager(page));
    },
});
