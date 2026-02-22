import type { PetPhoto, Prisma } from "@prisma/client";

export interface PetsPhotoRepository {
	create(data: Prisma.PetPhotoUncheckedCreateInput): Promise<PetPhoto>;
}
