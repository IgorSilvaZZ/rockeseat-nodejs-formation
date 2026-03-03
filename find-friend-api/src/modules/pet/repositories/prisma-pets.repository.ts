import type { Pet, Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import type { SearchPetsUseCaseRequest } from "../useCases/search-pets.useCase";
import type { PetsRepository, PetWithPhotos } from "./pets.repository";

export class PrismaPetsRepository implements PetsRepository {
	async findById(id: string): Promise<Pet | null> {
		const pet = await prisma.pet.findUnique({
			where: {
				id,
			},
		});

		return pet || null;
	}

	async searchMany({
		state,
		city,
		page,
		age,
		energyLevel,
		independencyLevel,
		size,
	}: SearchPetsUseCaseRequest): Promise<PetWithPhotos[]> {
		const pets = await prisma.pet.findMany({
			include: {
				petPhotos: true,
			},
			where: {
				org: {
					state,
					city,
				},
				...(age && { age }),
				...(energyLevel && { energyLevel }),
				...(independencyLevel && { independencyLevel }),
				...(size && { size }),
			},
			take: 10,
			skip: (page - 1) * 10,
		});

		return pets;
	}

	async create(data: Prisma.PetUncheckedCreateInput): Promise<Pet> {
		const pet = await prisma.pet.create({
			data,
		});

		return pet;
	}
}
