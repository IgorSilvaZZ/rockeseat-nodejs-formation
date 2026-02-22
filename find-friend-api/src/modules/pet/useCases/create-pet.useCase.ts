import type { AmbiencePet, Levels, Pet, PetAge, TypePet } from "@prisma/client";
import type { OrgsRepository } from "@/modules/org/repositories/orgs.repository";
import { ResourceNotFoundError } from "@/shared/errors/ResourceNotFoundError";
import type { Storage } from "@/shared/interfaces/Storage";
import { MaxPhotosPetError } from "../errors/MaxPhotosPetError";
import type { PetsRepository } from "../repositories/pets.repository";
import type { PetsPhotoRepository } from "../repositories/pets-photos.repository";

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

const MAX_PHOTOS = 6;

export class CreatePetUseCase {
	constructor(
		private petsRepository: PetsRepository,
		private petsPhotosRepository: PetsPhotoRepository,
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

		const photosUrls: string[] = [];

		if (photos && photos?.length > 0) {
			if (photos.length > MAX_PHOTOS) {
				throw new MaxPhotosPetError();
			}

			for (const item of photos) {
				const fileName = await this.localStorage.save(
					item.buffer,
					item.filename,
				);

				const photoUrl = this.localStorage.getUrl(fileName);

				await this.petsPhotosRepository.create({
					petId: pet.id,
					url: photoUrl,
				});

				photosUrls.push(photoUrl);
			}
		}

		return {
			pet,
			photos: photosUrls,
		};
	}
}
