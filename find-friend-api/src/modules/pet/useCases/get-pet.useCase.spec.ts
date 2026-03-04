import { AmbiencePet, Levels, PetAge } from "@prisma/client";
import { beforeEach, describe, expect, it } from "vitest";
import { OrgsRepositoryInMemory } from "@/modules/org/repositories/in-memory/in-memory-orgs.repository";
import { ResourceNotFoundError } from "@/shared/errors/ResourceNotFoundError";
import { makeOrgMock } from "@/utils/test/mocks/mock-org";
import { makePetMock } from "@/utils/test/mocks/mock-pet";
import { PetsRepositoryInMemory } from "../repositories/in-memory/in-memory-pets.repository";
import { PetsPhotosRepositoryInMemory } from "../repositories/in-memory/in-memory-pets-photos.repository";
import { GetPetUseCase } from "./get-pet.useCase";

describe("Get pet", () => {
	let petsRepositoryInMemory: PetsRepositoryInMemory;
	let orgsRepositoryInMemory: OrgsRepositoryInMemory;
	let petsPhotosRepositoryInMemory: PetsPhotosRepositoryInMemory;

	let getPetUseCase: GetPetUseCase;

	beforeEach(() => {
		petsPhotosRepositoryInMemory = new PetsPhotosRepositoryInMemory();

		orgsRepositoryInMemory = new OrgsRepositoryInMemory();

		petsRepositoryInMemory = new PetsRepositoryInMemory(
			petsPhotosRepositoryInMemory,
			orgsRepositoryInMemory,
		);

		getPetUseCase = new GetPetUseCase(petsRepositoryInMemory);
	});

	it("should be able to get a pet with photos and org by id", async () => {
		const { id: orgId } = await orgsRepositoryInMemory.create(makeOrgMock());

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

		const { id } = await petsRepositoryInMemory.create(petMock);

		await petsPhotosRepositoryInMemory.create({
			petId: id,
			url: "photo-url.jpg",
		});

		await petsPhotosRepositoryInMemory.create({
			petId: id,
			url: "photo-2-url.jpg",
		});

		const { pet } = await getPetUseCase.execute({ id });

		expect(pet.id).toEqual(expect.any(String));
		expect(pet.name).toEqual("Lua Negra");
		expect(pet).toHaveProperty("petPhotos");
		expect(pet.petPhotos).toHaveLength(2);
		expect(pet).toHaveProperty("org");
		expect(pet.org).toEqual(
			expect.objectContaining({
				id: orgId,
			}),
		);
	});

	it("should not be able to get a pet with non-existing id", async () => {
		await expect(() =>
			getPetUseCase.execute({ id: "non-existing-id" }),
		).rejects.toBeInstanceOf(ResourceNotFoundError);
	});
});
