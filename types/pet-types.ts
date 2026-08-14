export interface CreatePetType {
    name: string;
}

export interface PetType extends CreatePetType {
    id: number;
}