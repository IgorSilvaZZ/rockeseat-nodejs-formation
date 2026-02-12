import type { PetPhoto, Prisma } from "@prisma/client";

export interface PetPhotoRepository {
	create(data: Prisma.PetPhotoUncheckedCreateInput): Promise<PetPhoto>;
}
