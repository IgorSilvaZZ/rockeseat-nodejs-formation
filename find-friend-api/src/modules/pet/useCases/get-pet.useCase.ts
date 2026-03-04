import { ResourceNotFoundError } from "@/shared/errors/ResourceNotFoundError";
import type {
	PetsRepository,
	PetWithPhotosAndOrg,
} from "../repositories/pets.repository";

export interface GetPetUseCaseRequest {
	id: string;
}

export interface GetPetUseCaseResponse {
	pet: PetWithPhotosAndOrg;
}

export class GetPetUseCase {
	constructor(private petsRepository: PetsRepository) {}

	async execute({ id }: GetPetUseCaseRequest) {
		const pet = await this.petsRepository.findByIdWithPhotosAndOrg(id);

		if (!pet) {
			throw new ResourceNotFoundError();
		}

		return { pet };
	}
}
