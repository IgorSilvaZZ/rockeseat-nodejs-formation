import { PrismaGymsRepository } from "@/http/repositories/prisma-gyms-repository";

import { CreateGymUseCase } from "../create-gym.useCase";

export const makeCreateGymUseCase = () => {
	const prismaGymsRepository = new PrismaGymsRepository();

	const createGymUseCase = new CreateGymUseCase(prismaGymsRepository);

	return createGymUseCase;
};
