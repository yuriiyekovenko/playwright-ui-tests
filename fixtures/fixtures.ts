import { test as base } from '@playwright/test';
import { PageManager } from '../pages/page-manager';
import { PetClinicAPIClient } from '../clients/pet-clinic-api-client';

export { expect } from '@playwright/test';

type TestFixtures = {
    pages: PageManager;
    client: PetClinicAPIClient;
};

export const test = base.extend<TestFixtures>({
    pages: async ({ page }, use) => {
        await use(new PageManager(page));
    },
    client: async ({ request }, use) => {
        await use(new PetClinicAPIClient(request));
    },
});
