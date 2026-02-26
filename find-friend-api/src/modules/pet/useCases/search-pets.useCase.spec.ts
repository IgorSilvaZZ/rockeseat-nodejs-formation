import { it } from "node:test";
import { AmbiencePet, Levels, PetAge } from "@prisma/client";
import { beforeEach, describe } from "vitest";
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
		const orgData = makeOrgMock();

		const { id: orgId } = await orgsRepositoryInMemory.create({
			name: orgData.name,
			email: orgData.email,
			phone: orgData.phone,
			passwordHash: orgData.password,
			cep: orgData.address.cep,
			street: orgData.address.street,
			number: orgData.address.number,
			neighborhood: orgData.address.neighborhood,
			city: orgData.address.city,
			state: orgData.address.state,
		});

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
			photos: [
				{
					buffer: Buffer.from("fake-image-data"),
					filename: "lua-negra.jpg",
				},
				{
					buffer: Buffer.from("fake-image-data-2"),
					filename: "lua-negra.jpg",
				},
			],
		});
	});
});
