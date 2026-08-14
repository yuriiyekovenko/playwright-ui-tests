import { faker } from '@faker-js/faker'
import { CreatePetType } from '../types/pet-types'

export class PetTypeFactory {
    
    static random(): CreatePetType {
        return {
            name: `pet-type-${faker.string.uuid()}`
        }
    };
}