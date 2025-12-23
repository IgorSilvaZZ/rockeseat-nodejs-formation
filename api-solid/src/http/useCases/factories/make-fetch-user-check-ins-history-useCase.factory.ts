import { PrismaCheckInsRepository } from "@/http/repositories/prisma-check-ins-repository";

import { FetchUserCheckInsHistoryUseCase } from "../fetch-user-check-ins-history.useCase";

export const makeFetchUserCheckInsHistoryUseCase = () => {
	const prismaCheckInsRepository = new PrismaCheckInsRepository();

	const fetchUserCheckInsHistoryUseCase = new FetchUserCheckInsHistoryUseCase(
		prismaCheckInsRepository,
	);

	return fetchUserCheckInsHistoryUseCase;
};
