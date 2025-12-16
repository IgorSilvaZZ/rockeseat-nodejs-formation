import { Decimal } from "@prisma/client/runtime/library";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { InMemoryCheckInsRepository } from "../repositories/in-memory/in-memory.check-ins-repository";
import { InMemoryGymsRepository } from "../repositories/in-memory/in-memory-gym-repository";

import { CheckInUseCase } from "./check-in.useCase";
import { MaxDistanceError } from "./errors/max-distance.error";
import { MaxNumberOfCheckInsError } from "./errors/max-number-of-check-ins.error";

describe("CheckIn Use Case", () => {
	let gymsRepositoryInMemory: InMemoryGymsRepository;
	let checkInsRepositoryInMemory: InMemoryCheckInsRepository;

	let checkInUseCase: CheckInUseCase;

	beforeEach(async () => {
		gymsRepositoryInMemory = new InMemoryGymsRepository();
		checkInsRepositoryInMemory = new InMemoryCheckInsRepository();

		checkInUseCase = new CheckInUseCase(
			checkInsRepositoryInMemory,
			gymsRepositoryInMemory,
		);

		await gymsRepositoryInMemory.create({
			id: "gym-id-01",
			title: "Academia Slim",
			description: "Academia Slim description",
			latitude: -23.5092646,
			longitude: -46.4514587,
			phone: "",
		});

		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it("Should be able to create check-in", async () => {
		"";
		const { checkIn } = await checkInUseCase.execute({
			gymId: "gym-id-01",
			userId: "user-id-01",
			userLatitude: -23.5096754,
			userLongitude: -46.4515441,
		});

		expect(checkIn.id).toEqual(expect.any(String));
	});

	it("Should not be able to check-in twice in the same day", async () => {
		vi.setSystemTime(new Date(2025, 0, 2, 17, 45, 0));

		await checkInUseCase.execute({
			gymId: "gym-id-01",
			userId: "user-id-01",
			userLatitude: -23.5096754,
			userLongitude: -46.4515441,
		});

		await expect(() => {
			return checkInUseCase.execute({
				gymId: "gym-id-01",
				userId: "user-id-01",
				userLatitude: -23.5096754,
				userLongitude: -46.4515441,
			});
		}).rejects.toBeInstanceOf(MaxNumberOfCheckInsError);
	});

	it("Should able to check-in twice but in different days", async () => {
		vi.setSystemTime(new Date(2025, 0, 2, 17, 45, 0));

		await checkInUseCase.execute({
			gymId: "gym-id-01",
			userId: "user-id-01",
			userLatitude: -23.5096754,
			userLongitude: -46.4515441,
		});

		vi.setSystemTime(new Date(2025, 0, 3, 17, 45, 0));

		const { checkIn } = await checkInUseCase.execute({
			gymId: "gym-id-01",
			userId: "user-id-01",
			userLatitude: -23.5096754,
			userLongitude: -46.4515441,
		});

		expect(checkIn.id).toEqual(expect.any(String));
	});

	it("Should not be able to check in on distant gym", async () => {
		gymsRepositoryInMemory.allGym.push({
			id: "gym-id-02",
			title: "Smart Fit Itaquera",
			description: "Smart Fit Itaquera description",
			latitude: new Decimal(-23.5405341),
			longitude: new Decimal(-46.4713222),
			phone: "",
			createdAt: new Date(),
		});

		expect(() => {
			return checkInUseCase.execute({
				gymId: "gym-id-02",
				userId: "user-id-01",
				userLatitude: -23.5096754,
				userLongitude: -46.4515441,
			});
		}).rejects.toBeInstanceOf(MaxDistanceError);
	});
});
