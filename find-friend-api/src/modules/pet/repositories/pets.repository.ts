import type { Pet, PetPhoto, Prisma } from "@prisma/client";
import type { SearchPetsUseCaseRequest } from "../useCases/search-pets.useCase";

export type PetWithPhotos = Pet & {
	photos: PetPhoto[];
};

export interface PetsRepository {
	findById(id: string): Promise<Pet | null>;
	searchMany(data: SearchPetsUseCaseRequest): Promise<PetWithPhotos[]>;
	create(data: Prisma.PetUncheckedCreateInput): Promise<Pet>;
}
