import { test, expect } from '../../fixtures/fixtures';
import { PetTypeFactory } from '../../factories/pet-type-factory';
import { faker } from '@faker-js/faker';

/**
 * @returns random and hopefully unique positive integer not bigger than int32
 */
function fakeId() {
    return faker.number.int({ 
        min: 2 ** 30, 
        max: 2 ** 31 - 1 
    });
}

test('Create new PetType', async ({ client }) => {
    const newPetType = PetTypeFactory.random();
    const createdPetType = await client.petTypes.create(newPetType);
    expect(createdPetType).toEqual({
        id: expect.any(Number),
        name: newPetType.name
    });
});

for (const { title, payload } of [
    { title: 'empty payload', payload: {} },
    { title: 'unexpected field instead of name', payload: { unexpectedField: 'foo' } },
]) {
    test(`PetType creation fails if ${title} provided`, async ({ client }) => {
        const response = await client.petTypes.create(payload, 400);
        expect(await response.json()).toMatchObject({
            status: 400,
            detail: 'The request contains invalid or missing parameters',
        });
    });
}

test('Update existing PetType', async ({ client }) => {
    const payload = PetTypeFactory.random()
    const petType = await client.petTypes.create(payload);
    petType.name += " updated";
    await client.petTypes.update(petType.id, petType, 204);
    
    const updatedPetType = await client.petTypes.get(petType.id);
    expect(updatedPetType).toEqual(petType);
});

test('Updating non-existing PetType fails', async ({client}) => {
    const id = fakeId();
    const response = await client.petTypes.update(id, {id: id, name: faker.string.alpha(10)}, 404);
    expect(response.status()).toBe(404);
});

test(`Update PetType fails if empty payload provided`, async ({ client }) => {
    const newPetType = PetTypeFactory.random();
    const created = await client.petTypes.create(newPetType);
    const response = await client.petTypes.update(created.id, {}, 400);
    expect(await response.json()).toMatchObject({
        status: 400,
        detail: 'The request contains invalid or missing parameters'
    });
});

test(`Update PetType fails if 'id' field is missing in the payload`, async ({ client }) => {
    const newPetType = PetTypeFactory.random();
    const created = await client.petTypes.create(newPetType);
    const payload = { name: created.name + ' abc' };
    const response = await client.petTypes.update(created.id, payload, 400);
    expect(await response.json()).toMatchObject({
        status: 400,
        detail: 'The request contains invalid or missing parameters'
    });
});

test(`Update PetType fails if 'name' field is missing in the payload`, async ({ client }) => {
    const newPetType = PetTypeFactory.random();
    const created = await client.petTypes.create(newPetType);
    const payload = { id: created.id };
    const response = await client.petTypes.update(created.id, payload, 400);
    expect(await response.json()).toMatchObject({
        status: 400,
        detail: 'The request contains invalid or missing parameters'
    });
});

test('Get existing PetType', async ({ client }) => {
    const petType = PetTypeFactory.random();
    const created = await client.petTypes.create(petType);
    const retrieved = await client.petTypes.get(created.id);
    expect(retrieved).toEqual(created);
});

test('Get PetType fails if non-existing id provided', async ({ client }) => {
    const response = await client.petTypes.get(fakeId(), 404);
    expect(response.status()).toBe(404);
});

test('List all PetTypes', async ({ client }) => {
    const allPetTypes = await client.petTypes.getAll();
    expect(allPetTypes.length).toBeGreaterThan(0);
    for (const item of allPetTypes) {
        expect(item).toMatchObject({
            id: expect.any(Number),
            name: expect.any(String)
        })
    }
});

test('Delete PetType', async ({client}) => {
    const petType = PetTypeFactory.random();
    const created = await client.petTypes.create(petType)
    const deleted = await client.petTypes.delete(created.id);
    await client.petTypes.get(created.id, 404);
    expect(deleted).toBeUndefined();
});

test('Delete PetType fails if non-existing id provided', async ({client}) => {
    const response = await client.petTypes.delete(fakeId(), 404);
    expect(response.status()).toBe(404);
});

//TODO after pet api client added, try to delete petType while a pet of this type exists.