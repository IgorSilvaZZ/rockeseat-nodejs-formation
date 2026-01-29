import { PrismaOrgsRepository } from "../repositories/prisma-orgs.repository";
import { CreateOrgUseCase } from "../useCases/create-org.useCase";

export const makeCreateOrgUseCase = () => {
	const prismaOrgsRepository = new PrismaOrgsRepository();

	const createOrgUseCase = new CreateOrgUseCase(prismaOrgsRepository);

	return createOrgUseCase;
};
