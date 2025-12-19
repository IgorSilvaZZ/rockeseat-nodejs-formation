import { beforeEach, describe, expect, it } from "vitest";

import { InMemoryGymsRepository } from "../repositories/in-memory/in-memory-gym-repository";
import { FetchNearbyGymsUseCase } from "./fetch-nearby-gyms.useCase";

describe("Fetch Nearby Gyms Use Case", () => {
	let inMemoryGymsRepository: InMemoryGymsRepository;
	let fetchNearbyGymsUseCase: FetchNearbyGymsUseCase;

	beforeEach(async () => {
		inMemoryGymsRepository = new InMemoryGymsRepository();

		fetchNearbyGymsUseCase = new FetchNearbyGymsUseCase(inMemoryGymsRepository);
	});

	it("Should be able fetch nearby gyms", async () => {
		await inMemoryGymsRepository.create({
			title: "Academia Slim",
			description: "",
			latitude: -23.5092646,
			longitude: -46.4514587,
			phone: "",
		});

		await inMemoryGymsRepository.create({
			title: "Smart Fit Paulista",
			description: "",
			latitude: -23.5670244,
			longitude: -46.6519714,
			phone: "",
		});

		const { gyms } = await fetchNearbyGymsUseCase.execute({
			userLatitude: -23.5096754,
			userLongitude: -46.4515441,
		});

		expect(gyms).toHaveLength(1);
		expect(gyms).toEqual([expect.objectContaining({ title: "Academia Slim" })]);
	});
});
