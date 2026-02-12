import type { AmbiencePet, Levels, Pet, PetAge, TypePet } from "@prisma/client";
import type { OrgsRepository } from "@/modules/org/repositories/orgs.repository";
import { ResourceNotFoundError } from "@/shared/errors/ResourceNotFoundError";
import type { Storage } from "@/shared/interfaces/Storage";
import type { PetsRepository } from "../repositories/pets.repository";
import type { PetPhotoRepository } from "../repositories/pets-photos.repository";

export interface CreatePetUseCaseRequest {
	name: string;
	about?: string;
	type: TypePet;
	age: PetAge;
	size: Levels;
	energyLevel: number;
	independencyLevel: Levels;
	ambience: AmbiencePet;
	orgId: string;
	requirements: string[];
	photos?: {
		buffer: Buffer;
		filename: string;
	}[];
}

export interface CreatePetUseCaseResponse {
	pet: Pet;
}

export class CreatePetUseCase {
	constructor(
		private petsRepository: PetsRepository,
		private photoPetsRepository: PetPhotoRepository,
		private orgsRepository: OrgsRepository,
		private localStorage: Storage,
	) {}

	async execute({
		name,
		type,
		about,
		age,
		energyLevel,
		independencyLevel,
		ambience,
		orgId,
		size,
		requirements,
		photos,
	}: CreatePetUseCaseRequest) {
		const org = await this.orgsRepository.findById(orgId);

		if (!org) {
			throw new ResourceNotFoundError();
		}

		const pet = await this.petsRepository.create({
			name,
			type,
			about,
			age,
			energyLevel,
			independencyLevel,
			ambience,
			orgId,
			size,
			requirements,
		});

		if (photos && photos?.length > 0) {
			for (const item of photos) {
				const fileName = await this.localStorage.save(
					item.buffer,
					item.filename,
				);

				const photoUrl = this.localStorage.getUrl(fileName);

				await this.photoPetsRepository.create({ petId: pet.id, url: photoUrl });
			}
		}

		return {
			pet,
		};
	}
}
