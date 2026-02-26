import { randomUUID } from "node:crypto";
import type { Pet, Prisma } from "@prisma/client";
import type { OrgsRepositoryInMemory } from "@/modules/org/repositories/in-memory/in-memory-orgs.repository";
import type { SearchPetsUseCaseRequest } from "../../useCases/search-pets.useCase";
import type { PetsRepository, PetWithPhotos } from "../pets.repository";
import type { PetsPhotosRepositoryInMemory } from "./in-memory-pets-photos.repository";

export class PetsRepositoryInMemory implements PetsRepository {
	public pets: Pet[] = [];

	// Injetando os repositórios de PetsPhotos e Orgs para poder realizar as buscas e relacionamentos necessários (repositorios opcionais)
	constructor(
		private petsPhotosRepository?: PetsPhotosRepositoryInMemory,
		private orgsRepository?: OrgsRepositoryInMemory,
	) {}

	async findById(id: string): Promise<Pet | null> {
		const pet = this.pets.find((item) => item.id === id);

		return pet || null;
	}

	async searchMany({
		page,
		city,
		state,
		age,
		energyLevel,
		independencyLevel,
		size,
	}: SearchPetsUseCaseRequest): Promise<PetWithPhotos[]> {
		let filteredPets = this.pets;

		// Aplicando filtros de cidade e estado (Orgs)
		filteredPets = filteredPets.filter((pet) => {
			const org = this.orgsRepository?.orgs.find(
				(orgPet) => pet.orgId === orgPet.id,
			);

			if (!org) {
				return false;
			}

			if (org.state !== state) return false;
			if (org.city !== city) return false;

			return true;
		});

		// Aplicando filtros opcionais de idade, nível de energia, nível de independência e porte de cada pet
		if (age) {
			filteredPets = filteredPets.filter((pet) => pet.age === age);
		}

		if (energyLevel) {
			filteredPets = filteredPets.filter(
				(pet) => pet.energyLevel === energyLevel,
			);
		}

		if (independencyLevel) {
			filteredPets = filteredPets.filter(
				(pet) => pet.independencyLevel === independencyLevel,
			);
		}

		if (size) {
			filteredPets = filteredPets.filter((pet) => pet.size === size);
		}

		// Paginação
		const paginatedPets = filteredPets.slice((page - 1) * 20, page * 20);

		// Coletando as fotos para cada pet
		const petsWithPhotos = paginatedPets.map((pet) => ({
			...pet,
			photos:
				this.petsPhotosRepository?.petsPhotos.filter(
					(petPhoto) => petPhoto.petId === pet.id,
				) ?? [],
		}));

		return petsWithPhotos;
	}

	async create(data: Prisma.PetUncheckedCreateInput): Promise<Pet> {
		const pet = {
			...data,
			id: data.id ?? randomUUID(),
			about: data.about ?? "",
			requirements: data.requirements as string[],
			createdAt: new Date(),
		};

		this.pets.push(pet);

		return pet;
	}
}
