import type { FastifyReply, FastifyRequest } from "fastify";

import { makeGetUserMetricsUseCase } from "@/http/useCases/factories/make-get-user-metricts-useCase.factory";

export async function metrics(req: FastifyRequest, rep: FastifyReply) {
	const getUserMetricsUseCase = makeGetUserMetricsUseCase();

	const { checkInsCount } = await getUserMetricsUseCase.execute({
		userId: req.user.sub,
	});

	return rep.status(200).send({
		checkInsCount,
	});
}
