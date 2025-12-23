import { PrismaCheckInsRepository } from "@/http/repositories/prisma-check-ins-repository";

import { GetUserMetricsUseCase } from "../get-user-metrics.useCase";

export const makeGetUserMetricsUseCase = () => {
	const prismaCheckInsRepository = new PrismaCheckInsRepository();

	const getUserMetricsUseCase = new GetUserMetricsUseCase(
		prismaCheckInsRepository,
	);

	return getUserMetricsUseCase;
};
