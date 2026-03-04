import { PrismaPetsRepository } from "../repositories/prisma-pets.repository";
import { GetPetUseCase } from "../useCases/get-pet.useCase";

export const makeGetPetsUseCase = () => {
	const prismaPetsRepository = new PrismaPetsRepository();

	const getPetUseCase = new GetPetUseCase(prismaPetsRepository);

	return getPetUseCase;
};
