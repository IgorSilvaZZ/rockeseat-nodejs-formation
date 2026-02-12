import { randomUUID } from "node:crypto";
import type { Pet, Prisma } from "@prisma/client";
import type { PetsRepository } from "../pets.repository";

export class PetsRepositoryInMemory implements PetsRepository {
	public pets: Pet[] = [];

	async findById(id: string): Promise<Pet | null> {
		const pet = this.pets.find((item) => item.id === id);

		return pet || null;
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
