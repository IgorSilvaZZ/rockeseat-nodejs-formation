import { PrismaOrgsRepository } from "../repositories/prisma-orgs.repository";
import { AuthenticateUseCase } from "../useCases/authenticate.useCase";

export const makeAuthenticateUseCase = () => {
	const prismaOrgsRepository = new PrismaOrgsRepository();

	const authenticateUseCase = new AuthenticateUseCase(prismaOrgsRepository);

	return authenticateUseCase;
};
