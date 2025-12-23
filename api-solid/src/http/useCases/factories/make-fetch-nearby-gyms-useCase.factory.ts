import { PrismaGymsRepository } from "@/http/repositories/prisma-gyms-repository";

import { FetchNearbyGymsUseCase } from "../fetch-nearby-gyms.useCase";

export const makeNearbyGymsUseCase = () => {
	const prismaGymsRepository = new PrismaGymsRepository();

	const fetchNearbyGymsUseCase = new FetchNearbyGymsUseCase(
		prismaGymsRepository,
	);

	return fetchNearbyGymsUseCase;
};
