import type { Levels, Pet, PetAge } from "@prisma/client";
import type { PetsRepository } from "../repositories/pets.repository";

export interface SearchPetsUseCaseRequest {
	city: string;
	state: string;
	page: number;
	age?: PetAge;
	energyLevel?: number;
	size?: Levels;
	independencyLevel?: Levels;
}

export interface SearchPetsUseCaseResponse {
	pets: Pet[];
}

export class SearchPetsUseCase {
	constructor(private petsRepository: PetsRepository) {}

	async execute(
		data: SearchPetsUseCaseRequest,
	): Promise<SearchPetsUseCaseResponse> {
		const pets = await this.petsRepository.searchMany(data);

		return {
			pets,
		};
	}
}
