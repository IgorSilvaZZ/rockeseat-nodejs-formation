import type { Levels, Pet, PetAge } from "@prisma/client";
import type { OrgsRepository } from "@/modules/org/repositories/orgs.repository";
import { ResourceNotFoundError } from "@/shared/errors/ResourceNotFoundError";
import type { PetsRepository } from "../repositories/pets.repository";

export interface CreatePetUseCaseRequest {
	name: string;
	about?: string;
	age: PetAge;
	size: Levels;
	energyLevel: number;
	independencyLevel: Levels;
	photoBuffer?: Buffer;
	photoFilename?: string;
	orgId: string;
	requirements: string[];
}

export interface CreatePetUseCaseResponse {
	pet: Pet;
}

export class CreatePetUseCase {
	constructor(
		private petsRepository: PetsRepository,
		private orgsRepository: OrgsRepository,
	) {}

	async execute({
		name,
		about,
		age,
		energyLevel,
		independencyLevel,
		orgId,
		size,
		photoBuffer,
		photoFilename,
		requirements,
	}: CreatePetUseCaseRequest) {
		const org = await this.orgsRepository.findById(orgId);

		if (!org) {
			throw new ResourceNotFoundError();
		}

		let photoUrl: string | undefined;

		// Implementar serviço LocalStorage que vai fazer o upload da foto do pet

		const pet = await this.petsRepository.create({
			name,
			about,
			age,
			energyLevel,
			independencyLevel,
			orgId,
			size,
			photoUrl,
			requirements,
		});

		return {
			pet,
		};
	}
}
