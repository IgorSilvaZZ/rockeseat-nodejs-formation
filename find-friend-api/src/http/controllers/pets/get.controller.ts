import type { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { makeGetPetsUseCase } from "@/modules/pet/factories/make-get-pet-useCase.factory";

export async function get(req: FastifyRequest, rep: FastifyReply) {
	const getPetSchema = z.object({
		id: z.string(),
	});

	const petParams = getPetSchema.parse(req.params);

	const getPetUseCase = makeGetPetsUseCase();

	const { pet } = await getPetUseCase.execute(petParams);

	return rep.status(200).send({ pet });
}
