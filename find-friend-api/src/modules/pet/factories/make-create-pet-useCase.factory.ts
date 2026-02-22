import { PrismaOrgsRepository } from "@/modules/org/repositories/prisma-orgs.repository";
import { LocalStorage } from "@/shared/LocalStorage";
import { PrismaPetsRepository } from "../repositories/prisma-pets.repository";
import { PrismaPetsPhotosRepository } from "../repositories/prisma-pets-photos.repository";
import { CreatePetUseCase } from "../useCases/create-pet.useCase";

export const makeCreatePetUseCase = () => {
	const prismaPetsRepository = new PrismaPetsRepository();

	const prismaPetsPhotosRepository = new PrismaPetsPhotosRepository();

	const prismaOrgsRepository = new PrismaOrgsRepository();

	const localStorage = new LocalStorage();

	const createPetUseCase = new CreatePetUseCase(
		prismaPetsRepository,
		prismaPetsPhotosRepository,
		prismaOrgsRepository,
		localStorage,
	);

	return createPetUseCase;
};
