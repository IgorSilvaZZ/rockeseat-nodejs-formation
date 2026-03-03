import { PrismaPetsRepository } from "../repositories/prisma-pets.repository";
import { SearchPetsUseCase } from "../useCases/search-pets.useCase";

export const makeSearchPetsUseCase = () => {
	const prismaPetsRepository = new PrismaPetsRepository();

	const searchPetsUseCase = new SearchPetsUseCase(prismaPetsRepository);

	return searchPetsUseCase;
};
