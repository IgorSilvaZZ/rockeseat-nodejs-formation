import { AmbiencePet, Levels, PetAge } from "@prisma/client";
import { beforeEach, describe, expect, it } from "vitest";
import { OrgsRepositoryInMemory } from "@/modules/org/repositories/in-memory/in-memory-orgs.repository";
import { makeOrgMock } from "@/utils/test/mocks/mock-org";
import { makePetMock } from "@/utils/test/mocks/mock-pet";
import { PetsRepositoryInMemory } from "../repositories/in-memory/in-memory-pets.repository";
import { PetsPhotosRepositoryInMemory } from "../repositories/in-memory/in-memory-pets-photos.repository";
import { SearchPetsUseCase } from "./search-pets.useCase";

describe("Search pets", () => {
	let petsRepositoryInMemory: PetsRepositoryInMemory;
	let orgsRepositoryInMemory: OrgsRepositoryInMemory;
	let petsPhotosRepositoryInMemory: PetsPhotosRepositoryInMemory;

	let searchPetsUseCase: SearchPetsUseCase;

	beforeEach(() => {
		petsPhotosRepositoryInMemory = new PetsPhotosRepositoryInMemory();

		orgsRepositoryInMemory = new OrgsRepositoryInMemory();

		petsRepositoryInMemory = new PetsRepositoryInMemory(
			petsPhotosRepositoryInMemory,
			orgsRepositoryInMemory,
		);

		searchPetsUseCase = new SearchPetsUseCase(petsRepositoryInMemory);
	});

	it("should be able to search pets by city and state", async () => {
		const orgState = "SP";
		const orgCity = "São Paulo";

		const orgData = makeOrgMock({
			address: {
				state: orgState,
				city: orgCity,
			},
		});

		const { id: orgId } = await orgsRepositoryInMemory.create(orgData);

		const petMock = makePetMock({
			name: "Lua Negra",
			requirements: ["Proibido apartamento", "Necessário quintal"],
			about: "Descrição do pet",
			age: PetAge.ADULT,
			ambience: AmbiencePet.MEDIUM,
			energyLevel: 3,
			independencyLevel: Levels.LOW,
			orgId,
			size: Levels.MEDIUM,
			type: "CAT",
		});

		const petMock2 = makePetMock({
			name: "Flora",
			requirements: [
				"Proibido apartamento",
				"Necessário quintal",
				"Adora plantas",
				"Não gosta muito de contatos com pessoas novas",
			],
			about: "Descrição do pet",
			age: PetAge.ADULT,
			ambience: AmbiencePet.MEDIUM,
			energyLevel: 4,
			independencyLevel: Levels.MEDIUM,
			orgId,
			size: Levels.MEDIUM,
			type: "CAT",
		});

		await petsRepositoryInMemory.create(petMock);
		await petsRepositoryInMemory.create(petMock2);

		const { pets } = await searchPetsUseCase.execute({
			city: orgData.city,
			state: orgData.state,
			page: 1,
		});

		expect(pets).toHaveLength(2);
		expect(pets).toEqual([
			expect.objectContaining({
				name: petMock.name,
			}),
			expect.objectContaining({
				name: petMock2.name,
			}),
		]);
	});

	it("should be able empty pets with non-existing city and state", async () => {
		const { id: orgId } = await orgsRepositoryInMemory.create(
			makeOrgMock({
				address: {
					state: "SP",
					city: "São Paulo",
				},
			}),
		);

		await orgsRepositoryInMemory.create(
			makeOrgMock({
				address: {
					state: "MG",
					city: "Belo Horizonte",
				},
			}),
		);

		const petMock = makePetMock({
			name: "Lua Negra",
			requirements: ["Proibido apartamento", "Necessário quintal"],
			about: "Descrição do pet",
			age: PetAge.ADULT,
			ambience: AmbiencePet.MEDIUM,
			energyLevel: 3,
			independencyLevel: Levels.LOW,
			orgId,
			size: Levels.MEDIUM,
			type: "CAT",
		});

		await petsRepositoryInMemory.create(petMock);

		const { pets } = await searchPetsUseCase.execute({
			state: "MG",
			city: "Belo Horizonte",
			page: 1,
		});

		const { pets: pets2 } = await searchPetsUseCase.execute({
			state: "SP",
			city: "São Paulo",
			page: 1,
		});

		expect(pets).toHaveLength(0);
		expect(pets2).toHaveLength(1);
	});

	it("should be able to search pets by age", async () => {
		const { id: orgId } = await orgsRepositoryInMemory.create(
			makeOrgMock({
				address: {
					state: "SP",
					city: "São Paulo",
				},
			}),
		);

		const petMock = makePetMock({
			name: "Lua Negra",
			requirements: ["Proibido apartamento", "Necessário quintal"],
			about: "Descrição do pet",
			age: PetAge.ADULT,
			ambience: AmbiencePet.MEDIUM,
			energyLevel: 3,
			independencyLevel: Levels.LOW,
			orgId,
			size: Levels.MEDIUM,
			type: "CAT",
		});

		await petsRepositoryInMemory.create(petMock);

		const { pets } = await searchPetsUseCase.execute({
			state: "SP",
			city: "São Paulo",
			age: PetAge.ADULT,
			page: 1,
		});

		expect(pets).toHaveLength(1);
		expect(pets[0].age).toBe(PetAge.ADULT);
	});

	it("should be able to search pets by energyLevel", async () => {
		const { id: orgId } = await orgsRepositoryInMemory.create(
			makeOrgMock({
				address: {
					state: "SP",
					city: "São Paulo",
				},
			}),
		);

		const petMock = makePetMock({
			name: "Flora",
			requirements: [
				"Proibido apartamento",
				"Necessário quintal",
				"Adora plantas",
				"Não gosta muito de contatos com pessoas novas",
			],
			about: "Descrição do pet",
			age: PetAge.ADULT,
			ambience: AmbiencePet.MEDIUM,
			energyLevel: 4,
			independencyLevel: Levels.MEDIUM,
			orgId,
			size: Levels.MEDIUM,
			type: "CAT",
		});

		await petsRepositoryInMemory.create(petMock);

		const { pets } = await searchPetsUseCase.execute({
			state: "SP",
			city: "São Paulo",
			energyLevel: 4,
			page: 1,
		});

		expect(pets).toHaveLength(1);
		expect(pets[0].energyLevel).toBe(4);
	});

	it("should be able to search pets by independencyLevel", async () => {
		const { id: orgId } = await orgsRepositoryInMemory.create(
			makeOrgMock({
				address: {
					state: "SP",
					city: "São Paulo",
				},
			}),
		);

		const petMock = makePetMock({
			name: "Flora",
			requirements: [
				"Proibido apartamento",
				"Necessário quintal",
				"Adora plantas",
				"Não gosta muito de contatos com pessoas novas",
			],
			about: "Descrição do pet",
			age: PetAge.ADULT,
			ambience: AmbiencePet.MEDIUM,
			energyLevel: 4,
			independencyLevel: Levels.MEDIUM,
			orgId,
			size: Levels.MEDIUM,
			type: "CAT",
		});

		await petsRepositoryInMemory.create(petMock);

		const { pets } = await searchPetsUseCase.execute({
			state: "SP",
			city: "São Paulo",
			independencyLevel: Levels.MEDIUM,
			page: 1,
		});

		expect(pets).toHaveLength(1);
		expect(pets[0].independencyLevel).toBe(Levels.MEDIUM);
	});

	it("should be able to search pets by size", async () => {
		const { id: orgId } = await orgsRepositoryInMemory.create(
			makeOrgMock({
				address: {
					state: "SP",
					city: "São Paulo",
				},
			}),
		);

		const petMock = makePetMock({
			name: "Lua Negra",
			requirements: ["Proibido apartamento", "Necessário quintal"],
			about: "Descrição do pet",
			age: PetAge.ADULT,
			ambience: AmbiencePet.MEDIUM,
			energyLevel: 3,
			independencyLevel: Levels.LOW,
			orgId,
			size: Levels.MEDIUM,
			type: "CAT",
		});

		await petsRepositoryInMemory.create(petMock);

		const { pets } = await searchPetsUseCase.execute({
			state: "SP",
			city: "São Paulo",
			size: Levels.MEDIUM,
			page: 1,
		});

		expect(pets).toHaveLength(1);
		expect(pets[0].size).toBe(Levels.MEDIUM);
	});
});
