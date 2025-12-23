import { PrismaGymsRepository } from "@/http/repositories/prisma-gyms-repository";

import { SearchGymsUseCase } from "../search-gyms.useCase";

export const makeSearchGymsUseCase = () => {
	const prismaGymsRepository = new PrismaGymsRepository();

	const searchGymsUseCase = new SearchGymsUseCase(prismaGymsRepository);

	return searchGymsUseCase;
};
