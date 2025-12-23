import { PrismaUsersRepository } from "@/http/repositories/prisma-users-repository";

import { GetUserProfileUseCase } from "../get-user-profile.useCase";

export const makeGetUserProfileUseCase = () => {
	const prismaUsersRepository = new PrismaUsersRepository();

	const getUserProfileUseCase = new GetUserProfileUseCase(
		prismaUsersRepository,
	);

	return getUserProfileUseCase;
};
