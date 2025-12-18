import { beforeEach, describe, expect, it } from "vitest";

import { InMemoryGymsRepository } from "../repositories/in-memory/in-memory-gym-repository";

import { CreateGymUseCase } from "./create-gym.useCase";

describe("Register Gym Use Case", () => {
	let inMemoryGymsRepository: InMemoryGymsRepository;
	let createGymUseCase: CreateGymUseCase;

	beforeEach(() => {
		inMemoryGymsRepository = new InMemoryGymsRepository();

		createGymUseCase = new CreateGymUseCase(inMemoryGymsRepository);
	});

	it("Should be able to register new gym", async () => {
		const { gym } = await createGymUseCase.execute({
			title: "Academia Slim",
			description: "Academia Slim description",
			latitude: -23.5092646,
			longitude: -46.4514587,
			phone: "",
		});

		expect(gym).toHaveProperty("id");
		expect(gym.id).toEqual(expect.any(String));
	});
});
