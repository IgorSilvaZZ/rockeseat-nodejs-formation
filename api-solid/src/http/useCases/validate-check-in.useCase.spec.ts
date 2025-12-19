import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { InMemoryCheckInsRepository } from "../repositories/in-memory/in-memory.check-ins-repository";
import { LateCheckInValidationError } from "./errors/late-check-in-validation.error";
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
		vi.useRealTimers();
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
		await expect(() => {
			return validateCheckInUseCase.execute({
				checkInId: "inexistent-check-in-id",
			});
		}).rejects.toBeInstanceOf(ResourceNotFoundError);
	});

	it("Should not be able to validate the check-in after 20 minutes of its creation", async () => {
		vi.setSystemTime(new Date(2025, 12, 18, 12, 0));

		const createdCheckIn = await checkInsRepositoryInMemory.create({
			gymId: "gym-id-01",
			userId: "user-id-01",
		});

		const twentyOneMinutesInMs = 1000 * 60 * 21;

		// 21 Minutos depois
		vi.advanceTimersByTime(twentyOneMinutesInMs);

		await expect(() => {
			return validateCheckInUseCase.execute({
				checkInId: createdCheckIn.id,
			});
		}).rejects.toBeInstanceOf(LateCheckInValidationError);
	});
});
