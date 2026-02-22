import type { PetPhoto, Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";

import type { PetsPhotoRepository } from "./pets-photos.repository";

export class PrismaPetsPhotosRepository implements PetsPhotoRepository {
	async create(data: Prisma.PetPhotoUncheckedCreateInput): Promise<PetPhoto> {
		const petPhoto = await prisma.petPhoto.create({
			data,
		});

		return petPhoto;
	}
}
