import type { CheckIn } from "@prisma/client";
import dayjs from "dayjs";

import type { CheckInsRepository } from "../repositories/check-ins-repository";

import { LateCheckInValidationError } from "./errors/late-check-in-validation.error";
import { ResourceNotFoundError } from "./errors/resource-not-found.error";

export type ValidateCheckInUseCaseRequest = {
	checkInId: string;
};

export type ValidateCheckInUseCaseResponse = {
	checkIn: CheckIn;
};

export class ValidateCheckInUseCase {
	constructor(private checkInsRepository: CheckInsRepository) {}

	async execute({
		checkInId,
	}: ValidateCheckInUseCaseRequest): Promise<ValidateCheckInUseCaseResponse> {
		const checkIn = await this.checkInsRepository.findById(checkInId);

		if (!checkIn) {
			throw new ResourceNotFoundError();
		}

		const distanceInMinutesFromCheckInCreation = dayjs(new Date()).diff(
			checkIn.createdAt, // Sempre indicando a data mais antiga primeiro
			"minutes",
		);

		if (distanceInMinutesFromCheckInCreation > 20) {
			throw new LateCheckInValidationError();
		}

		checkIn.validatedAt = new Date();

		await this.checkInsRepository.save(checkIn);

		return {
			checkIn,
		};
	}
}
