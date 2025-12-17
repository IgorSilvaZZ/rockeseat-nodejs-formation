import { beforeEach, describe, expect, it } from "vitest";

import { InMemoryCheckInsRepository } from "../repositories/in-memory/in-memory.check-ins-repository";
import { GetUserMetricsUseCase } from "./get-user-metrics.useCase";

describe("Get User Metrics Use Case", () => {
	let checkInsRepositoryInMemory: InMemoryCheckInsRepository;
	let getUserMetricsUseCase: GetUserMetricsUseCase;

	beforeEach(async () => {
		checkInsRepositoryInMemory = new InMemoryCheckInsRepository();

		getUserMetricsUseCase = new GetUserMetricsUseCase(
			checkInsRepositoryInMemory,
		);
	});

	it("Should be to get check-ins count from metrics", async () => {
		await checkInsRepositoryInMemory.create({
			gymId: "gym-id-01",
			userId: "user-id-01",
		});

		await checkInsRepositoryInMemory.create({
			gymId: "gym-id-02",
			userId: "user-id-01",
		});

		const { checkInsCount } = await getUserMetricsUseCase.execute({
			userId: "user-id-01",
		});

		expect(checkInsCount).toEqual(2);
	});
});
