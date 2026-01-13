import type { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";

import { makeValidateCheckInUseCase } from "@/http/useCases/factories/make-validate-check-ins-useCase.factory";

export async function validate(req: FastifyRequest, rep: FastifyReply) {
	const validateCheckInParamsSchema = z.object({
		checkInId: z.uuid(),
	});

	const { checkInId } = validateCheckInParamsSchema.parse(req.params);

	const validateCheckInUseCase = makeValidateCheckInUseCase();

	await validateCheckInUseCase.execute({
		checkInId,
	});

	return rep.status(204).send();
}
