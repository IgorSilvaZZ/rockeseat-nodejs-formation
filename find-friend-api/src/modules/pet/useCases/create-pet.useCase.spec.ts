import { AmbiencePet, Levels, PetAge } from "@prisma/client";
import { beforeEach, describe, expect, it } from "vitest";
import { OrgsRepositoryInMemory } from "@/modules/org/repositories/in-memory/in-memory-orgs.repository";
import { ResourceNotFoundError } from "@/shared/errors/ResourceNotFoundError";
import { StorageFake } from "@/utils/test/fakes/storage-fake";
import { makeOrgMock } from "@/utils/test/mocks/mock-org";
import { makePetMock } from "@/utils/test/mocks/mock-pet";
import { MaxPhotosPetError } from "../errors/MaxPhotosPetError";
import { PetsRepositoryInMemory } from "../repositories/in-memory/in-memory-pets.repository";
import { PetsPhotosRepositoryInMemory } from "../repositories/in-memory/in-memory-pets-photos.repository";
import { CreatePetUseCase } from "./create-pet.useCase";

describe("Create pet", () => {
	let petsRepositoryInMemory: PetsRepositoryInMemory;
	let orgsRepositoryInMemory: OrgsRepositoryInMemory;
	let petsPhotosRepositoryInMemory: PetsPhotosRepositoryInMemory;

	let storageFake: StorageFake;

	let createPetUseCase: CreatePetUseCase;

	beforeEach(() => {
		orgsRepositoryInMemory = new OrgsRepositoryInMemory();

		petsRepositoryInMemory = new PetsRepositoryInMemory();

		petsPhotosRepositoryInMemory = new PetsPhotosRepositoryInMemory();

		storageFake = new StorageFake();

		createPetUseCase = new CreatePetUseCase(
			petsRepositoryInMemory,
			petsPhotosRepositoryInMemory,
			orgsRepositoryInMemory,
			storageFake,
		);
	});

	it("should be able create a new pet in organization", async () => {
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
		});

		const { pet, photos } = await createPetUseCase.execute(petMock);

		expect(pet).toHaveProperty("id");
		expect(pet.id).toEqual(expect.any(String));
		expect(photos).toHaveLength(0);
		expect(petsRepositoryInMemory.pets).toHaveLength(1);
	});

	it("should be able create a new pet in organization with field photo", async () => {
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
			photos: [
				{
					buffer: Buffer.from("fake-image-data"),
					filename: "flora.jpg",
				},
				{
					buffer: Buffer.from("fake-image-data-2"),
					filename: "flora-2.jpg",
				},
			],
		});

		const { pet, photos } = await createPetUseCase.execute(petMock);

		expect(photos).toHaveLength(2);
		expect(petsPhotosRepositoryInMemory.petsPhotos).toEqual([
			expect.objectContaining({ petId: pet.id }),
			expect.objectContaining({ petId: pet.id }),
		]);
		expect(petsPhotosRepositoryInMemory.petsPhotos).toHaveLength(2);
		expect(petsRepositoryInMemory.pets).toHaveLength(1);
	});

	it("should not be able create a new pet with organization not exists", async () => {
		const petMock = makePetMock({
			name: "Lua Negra",
			requirements: ["Proibido apartamento", "Necessário quintal"],
			about: "Descrição do pet",
			age: PetAge.ADULT,
			ambience: AmbiencePet.MEDIUM,
			energyLevel: 3,
			independencyLevel: Levels.LOW,
			orgId: "org-id-not-exists",
			size: Levels.MEDIUM,
			type: "CAT",
		});

		await expect(() =>
			createPetUseCase.execute(petMock),
		).rejects.toBeInstanceOf(ResourceNotFoundError);
	});

	it("should not be able create a new pet with more than 6 photos", async () => {
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

		const photos = Array.from({ length: 7 }).map((_, index) => ({
			buffer: Buffer.from(`fake-image-data-${index}`),
			filename: `photo-${index}.jpg`,
		}));

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
			photos,
		});

		await expect(() =>
			createPetUseCase.execute(petMock),
		).rejects.toBeInstanceOf(MaxPhotosPetError);
	});
});
