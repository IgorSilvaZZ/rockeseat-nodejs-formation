import type { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";

import { makeSearchGymsUseCase } from "@/http/useCases/factories/make-search-gyms-useCase.factory";

export async function search(req: FastifyRequest, rep: FastifyReply) {
	const searchGymsQuerySchema = z.object({
		q: z.string(),
		page: z.coerce.number().min(1).default(1),
	});

	const { q, page } = searchGymsQuerySchema.parse(req.query);

	const searchGymsUseCase = makeSearchGymsUseCase();

	const { gyms } = await searchGymsUseCase.execute({
		query: q,
		page,
	});

	return rep.status(200).send({
		gyms,
	});
}
