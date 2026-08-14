import { APIResponse, type APIRequestContext } from '@playwright/test';
import { CreatePetType, PetType } from '../types/pet-types';

export class PetTypesAPIClient {
    private readonly resourcePath = '/petclinic/api/pettypes';

    constructor(private request: APIRequestContext) {}

    async create(payload: CreatePetType): Promise<PetType>;
    async create(payload: CreatePetType, expectedStatus: 201): Promise<PetType>;
    async create(payload: unknown, expectedStatus: number): Promise<APIResponse>;
    async create(payload: unknown, expectedStatus = 201): Promise<PetType | APIResponse> {
        const response = await this.request.post(this.resourcePath, { data: payload });

        if (response.status() !== expectedStatus) {
            throw new Error(
                `POST PetType failed: expected status ${expectedStatus} 
                but received ${response.status()} ${response.statusText()}`,
            );
        }
        if (expectedStatus === 201) {
            return (await response.json()) as PetType;
        }

        return response;
    }

    async getAll(): Promise<PetType[]> {
        const response = await this.request.get(this.resourcePath);
        if (response.status() !== 200) {
            throw new Error(
                `Failed to get all PetTypes: ${response.status()} ${response.statusText()}`,
            );
        }
        return (await response.json()) as PetType[];
    }

    async get(id: number): Promise<PetType>;
    async get(id: number, expectedStatus: 200): Promise<PetType>;
    async get(id: number, expectedStatus: number): Promise<APIResponse>;
    async get(id: number, expectedStatus = 200): Promise<PetType | APIResponse> {
        const response = await this.request.get(`${this.resourcePath}/${id}`);

        if (response.status() !== expectedStatus) {
            throw new Error(
                `GET PetType ${id} failed: expected status ${expectedStatus} 
                but received ${response.status()} ${response.statusText()}`,
            );
        }
        if (expectedStatus === 200) {
            return (await response.json()) as PetType;
        }

        return response;
    }

    async delete(id: number): Promise<void>;
    async delete(id: number, expectedStatus: 204): Promise<void>;
    async delete(id: number, expectedStatus: number): Promise<APIResponse>;
    async delete(id: number, expectedStatus = 204): Promise<void | APIResponse> {
        const response = await this.request.delete(`${this.resourcePath}/${id}`);

        if (response.status() !== expectedStatus) {
            throw new Error(
                `DELETE PetType ${id} failed: expected status ${expectedStatus} 
                but received ${response.status()} ${response.statusText()}`,
            );
        }
        if (response.status() !== 204) {
            return response;
        }
    }

    async update(id: number, petType: PetType): Promise<void>;
    async update(id: number, petType: PetType, expectedStatus: 204): Promise<void>;
    async update(id: number, petType: unknown, expectedStatus: number): Promise<APIResponse>;
    async update(id: number, petType: unknown, expectedStatus = 204): Promise<void | APIResponse> {
        const response = await this.request.put(`${this.resourcePath}/${id}`, { data: petType });

        if (response.status() !== expectedStatus) {
            throw new Error(
                `PUT PetType ${id} failed: expected status ${expectedStatus} 
                but received ${response.status()} ${response.statusText()}`,
            );
        }

        if (response.status() !== 204) {
            return response;
        }
    }
}
