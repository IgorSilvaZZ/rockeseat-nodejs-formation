import { PrismaCheckInsRepository } from "@/http/repositories/prisma-check-ins-repository";
import { PrismaGymsRepository } from "@/http/repositories/prisma-gyms-repository";

import { CheckInUseCase } from "../check-in.useCase";

export const makeCheckInUseCase = () => {
	const prismaCheckInsRepository = new PrismaCheckInsRepository();
	const prismaGymsRepository = new PrismaGymsRepository();

	const checkInUseCase = new CheckInUseCase(
		prismaCheckInsRepository,
		prismaGymsRepository,
	);

	return checkInUseCase;
};
