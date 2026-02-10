import type { Levels, Pet, PetAge } from "@prisma/client";
import type { OrgsRepository } from "@/modules/org/repositories/orgs.repository";
import { ResourceNotFoundError } from "@/shared/errors/ResourceNotFoundError";
import type { Storage } from "@/shared/interfaces/Storage";
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
		private localStorage: Storage,
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

		if (photoBuffer && photoFilename) {
			const fileName = await this.localStorage.save(photoBuffer, photoFilename);

			photoUrl = this.localStorage.getUrl(fileName);
		}

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
