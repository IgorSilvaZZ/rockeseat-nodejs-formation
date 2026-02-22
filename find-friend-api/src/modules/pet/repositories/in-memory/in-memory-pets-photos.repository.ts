import { randomUUID } from "node:crypto";
import type { PetPhoto, Prisma } from "@prisma/client";
import type { PetsPhotoRepository } from "../pets-photos.repository";

export class PetsPhotosRepositoryInMemory implements PetsPhotoRepository {
	public petsPhotos: PetPhoto[] = [];

	async create(data: Prisma.PetPhotoUncheckedCreateInput): Promise<PetPhoto> {
		const petPhoto = {
			...data,
			id: data.id ?? randomUUID(),
			createdAt: new Date(),
		};

		this.petsPhotos.push(petPhoto);

		return petPhoto;
	}
}
