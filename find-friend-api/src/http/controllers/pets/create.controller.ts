import { AmbiencePet, Levels, PetAge, TypePet } from "@prisma/client";
import type { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { makeCreatePetUseCase } from "@/modules/pet/factories/make-create-pet-useCase.factory";

async function create(req: FastifyRequest, rep: FastifyReply) {
	const createPetSchema = z.object({
		name: z.string().min(1).max(250),
		about: z.string(),
		type: z.enum(TypePet),
		age: z.enum(PetAge),
		size: z.enum(Levels),
		energyLevel: z.number().int().min(1).max(5),
		independencyLevel: z.enum(Levels),
		ambience: z.enum(AmbiencePet),
		requirements: z.array(z.string()),
		orgId: z.string(),
		photos: z.array(
			z.object({
				url: z.string().min(1),
			}),
		).nullable,
	});

	const petData = createPetSchema.parse(req.body);

	const createPetUseCase = makeCreatePetUseCase();

	await createPetUseCase.execute(petData);

	return rep.status(201).send();
}
