import { beforeEach, describe, expect, it } from "vitest";

import { InMemoryCheckInsRepository } from "../repositories/in-memory/in-memory.check-ins-repository";
import { InMemoryGymsRepository } from "../repositories/in-memory/in-memory-gym-repository";

import { FetchUserCheckInsHistoryUseCase } from "./fetch-user-check-ins-history.useCase";

describe("CheckIn Use Case", () => {
	let checkInsRepositoryInMemory: InMemoryCheckInsRepository;

	let fetchUserCheckInsHistoryUseCase: FetchUserCheckInsHistoryUseCase;

	beforeEach(async () => {
		checkInsRepositoryInMemory = new InMemoryCheckInsRepository();

		fetchUserCheckInsHistoryUseCase = new FetchUserCheckInsHistoryUseCase(
			checkInsRepositoryInMemory,
		);
	});

	it("Should be able to fetch check-ins history", async () => {
		await checkInsRepositoryInMemory.create({
			gymId: "gym-id-01",
			userId: "user-id-01",
		});

		await checkInsRepositoryInMemory.create({
			gymId: "gym-id-02",
			userId: "user-id-01",
		});

		const { checkIns } = await fetchUserCheckInsHistoryUseCase.execute({
			userId: "user-id-01",
			page: 1,
		});

		expect(checkIns).toHaveLength(2);
		expect(checkIns).toEqual([
			expect.objectContaining({ gymId: "gym-id-01" }),
			expect.objectContaining({ gymId: "gym-id-02" }),
		]);
	});

	it("Should be able to fetch paginated check-ins history", async () => {
		for (let i = 1; i <= 22; i++) {
			await checkInsRepositoryInMemory.create({
				gymId: `gym-id-${i}`,
				userId: "user-id-01",
			});
		}

		const { checkIns } = await fetchUserCheckInsHistoryUseCase.execute({
			userId: "user-id-01",
			page: 2,
		});

		expect(checkIns).toHaveLength(2);
		expect(checkIns).toEqual([
			expect.objectContaining({ gymId: "gym-id-21" }),
			expect.objectContaining({ gymId: "gym-id-22" }),
		]);
	});
});
