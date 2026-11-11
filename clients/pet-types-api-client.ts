import { expect, type APIRequestContext, type APIResponse } from '@playwright/test';
import type { CreatePetType, PetType } from '../types/pet-types';

/**
 * Two levels of API:
 * - `*Raw` methods send a request and return the untouched `APIResponse`
 *   (use them in negative tests and assert on the response yourself);
 * - methods without suffix are happy-path helpers: they expect success
 *   and return typed data.
 */
export class PetTypesAPIClient {
    private readonly resourcePath = '/petclinic/api/pettypes';

    constructor(private readonly request: APIRequestContext) {}

    // ---- raw ----

    createRaw(payload: unknown): Promise<APIResponse> {
        return this.request.post(this.resourcePath, { data: payload });
    }

    getAllRaw(): Promise<APIResponse> {
        return this.request.get(this.resourcePath);
    }

    getRaw(id: number): Promise<APIResponse> {
        return this.request.get(`${this.resourcePath}/${id}`);
    }

    updateRaw(id: number, payload: unknown): Promise<APIResponse> {
        return this.request.put(`${this.resourcePath}/${id}`, { data: payload });
    }

    deleteRaw(id: number): Promise<APIResponse> {
        return this.request.delete(`${this.resourcePath}/${id}`);
    }

    // ---- happy path ----

    async create(payload: CreatePetType): Promise<PetType> {
        const response = await this.createRaw(payload);
        await this.expectStatus(response, 201, 'POST PetType');
        return (await response.json()) as PetType;
    }

    async getAll(): Promise<PetType[]> {
        const response = await this.getAllRaw();
        await this.expectStatus(response, 200, 'GET all PetTypes');
        return (await response.json()) as PetType[];
    }

    async get(id: number): Promise<PetType> {
        const response = await this.getRaw(id);
        await this.expectStatus(response, 200, `GET PetType ${id}`);
        return (await response.json()) as PetType;
    }

    async update(id: number, petType: PetType): Promise<void> {
        const response = await this.updateRaw(id, petType);
        await this.expectStatus(response, 204, `PUT PetType ${id}`);
    }

    async delete(id: number): Promise<void> {
        const response = await this.deleteRaw(id);
        await this.expectStatus(response, 204, `DELETE PetType ${id}`);
    }

    private async expectStatus(response: APIResponse, expected: number, operation: string) {
        expect(
            response.status(),
            `${operation}: expected ${expected}, got ${response.status()} ${response.statusText()}. Body: ${await response.text()}`,
        ).toBe(expected);
    }
}
