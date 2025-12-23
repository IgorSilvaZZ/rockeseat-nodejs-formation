import { PrismaCheckInsRepository } from "@/http/repositories/prisma-check-ins-repository";

import { ValidateCheckInUseCase } from "../validate-check-in.useCase";

export const makeValidateCheckInUseCase = () => {
	const prismaCheckInsRepository = new PrismaCheckInsRepository();

	const validateCheckInUseCase = new ValidateCheckInUseCase(
		prismaCheckInsRepository,
	);

	return validateCheckInUseCase;
};
