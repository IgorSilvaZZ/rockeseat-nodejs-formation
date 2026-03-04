import type { Org, Pet, PetPhoto, Prisma } from "@prisma/client";
import type { SearchPetsUseCaseRequest } from "../useCases/search-pets.useCase";

export type PetWithPhotos = Pet & {
	petPhotos: PetPhoto[];
};

export type PetWithPhotosAndOrg = PetWithPhotos & {
	org: Org | null;
};

export interface PetsRepository {
	findById(id: string): Promise<Pet | null>;
	findByIdWithPhotosAndOrg(id: string): Promise<PetWithPhotosAndOrg | null>;
	searchMany(data: SearchPetsUseCaseRequest): Promise<PetWithPhotos[]>;
	create(data: Prisma.PetUncheckedCreateInput): Promise<Pet>;
}
