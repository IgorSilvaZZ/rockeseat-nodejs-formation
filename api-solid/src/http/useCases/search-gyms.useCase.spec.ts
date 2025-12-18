import { beforeEach, describe, expect, it } from "vitest";

import { InMemoryGymsRepository } from "../repositories/in-memory/in-memory-gym-repository";
import { SearchGymsUseCase } from "./search-gyms.useCase";

describe("Search Gyms Use Case", () => {
	let inMemoryGymsRepository: InMemoryGymsRepository;
	let searchGymsUseCase: SearchGymsUseCase;

	beforeEach(async () => {
		inMemoryGymsRepository = new InMemoryGymsRepository();

		searchGymsUseCase = new SearchGymsUseCase(inMemoryGymsRepository);
	});

	it("Should be able to search for gyms", async () => {
		await inMemoryGymsRepository.create({
			title: "Academia Slim 1",
			description: "Academia Slim description",
			latitude: -23.5092646,
			longitude: -46.4514587,
			phone: "",
		});

		await inMemoryGymsRepository.create({
			title: "Academia Slim 2",
			description: "Academia Slim description",
			latitude: -23.5092646,
			longitude: -46.4514587,
			phone: "",
		});

		const { gyms } = await searchGymsUseCase.execute({
			query: "Academia Slim",
			page: 1,
		});

		expect(gyms).toHaveLength(2);
		expect(gyms).toEqual([
			expect.objectContaining({ title: "Academia Slim 1" }),
			expect.objectContaining({ title: "Academia Slim 2" }),
		]);
	});

	it("Should be able to fetch paginated gyms search", async () => {
		for (let i = 1; i <= 22; i++) {
			await inMemoryGymsRepository.create({
				title: `Academia Slim ${i}`,
				description: `Academia Slim description ${i}`,
				latitude: -23.5092646,
				longitude: -46.4514587,
				phone: "",
			});
		}

		const { gyms } = await searchGymsUseCase.execute({
			query: "Academia Slim",
			page: 2,
		});

		expect(gyms).toHaveLength(2);
		expect(gyms).toEqual([
			expect.objectContaining({ title: "Academia Slim 21" }),
			expect.objectContaining({ title: "Academia Slim 22" }),
		]);
	});
});
