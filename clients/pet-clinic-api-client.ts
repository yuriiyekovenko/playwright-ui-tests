import { APIRequestContext } from '@playwright/test';
import { PetTypesAPIClient } from './pet-types-api-client';

export class PetClinicAPIClient {
    readonly petTypes: PetTypesAPIClient;

    constructor(request: APIRequestContext) {
        this.petTypes = new PetTypesAPIClient(request);
    }
}
