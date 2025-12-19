import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { InMemoryCheckInsRepository } from "../repositories/in-memory/in-memory.check-ins-repository";

import { ResourceNotFoundError } from "./errors/resource-not-found.error";

import { ValidateCheckInUseCase } from "./validate-check-in.useCase";

describe("Validate Check-in Use Case", () => {
	let checkInsRepositoryInMemory: InMemoryCheckInsRepository;
	let validateCheckInUseCase: ValidateCheckInUseCase;

	beforeEach(async () => {
		checkInsRepositoryInMemory = new InMemoryCheckInsRepository();

		validateCheckInUseCase = new ValidateCheckInUseCase(
			checkInsRepositoryInMemory,
		);

		vi.useFakeTimers();
	});

	afterEach(() => {
		// vi.useRealTimers();
	});

	it("Should be able to validate the check-in", async () => {
		const createdCheckIn = await checkInsRepositoryInMemory.create({
			gymId: "gym-id-01",
			userId: "user-id-01",
		});

		const { checkIn } = await validateCheckInUseCase.execute({
			checkInId: createdCheckIn.id,
		});

		expect(checkIn.validatedAt).toEqual(expect.any(Date));
		expect(checkInsRepositoryInMemory.checkIns[0].validatedAt).toEqual(
			expect.any(Date),
		);
	});

	it("Should not be able to validate an inexistent check-in", async () => {
		expect(() => {
			return validateCheckInUseCase.execute({
				checkInId: "inexistent-check-in-id",
			});
		}).rejects.toBeInstanceOf(ResourceNotFoundError);
	});
});
