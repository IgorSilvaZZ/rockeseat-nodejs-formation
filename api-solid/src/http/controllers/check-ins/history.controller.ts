import type { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";

import { makeFetchUserCheckInsHistoryUseCase } from "@/http/useCases/factories/make-fetch-user-check-ins-history-useCase.factory";

export async function history(req: FastifyRequest, rep: FastifyReply) {
	const checkInHistoryQuerySchema = z.object({
		page: z.coerce.number().min(1).default(1),
	});

	const { page } = checkInHistoryQuerySchema.parse(req.params);

	const fetchUserCheckInsHistoryUseCase = makeFetchUserCheckInsHistoryUseCase();

	const { checkIns } = await fetchUserCheckInsHistoryUseCase.execute({
		userId: req.user.sub,
		page,
	});

	return rep.status(200).send({
		checkIns,
	});
}
