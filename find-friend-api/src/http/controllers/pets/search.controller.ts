import { Levels, PetAge } from "@prisma/client";
import type { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { makeSearchPetsUseCase } from "@/modules/pet/factories/make-search-pets.useCase";

export async function search(req: FastifyRequest, rep: FastifyReply) {
	const searchPetsSchema = z.object({
		city: z.string(),
		state: z.string(),
		age: z.enum(PetAge).optional(),
		size: z.enum(Levels).optional(),
		energyLevel: z.coerce.number().int().min(1).max(5).optional(),
		independencyLevel: z.enum(Levels).optional(),
		page: z.coerce.number().int().min(1).default(1),
	});

	const petSearchData = searchPetsSchema.parse(req.query);

	const searchPetsUseCase = makeSearchPetsUseCase();

	const { pets } = await searchPetsUseCase.execute(petSearchData);

	return rep.status(200).send({ pets });
}
