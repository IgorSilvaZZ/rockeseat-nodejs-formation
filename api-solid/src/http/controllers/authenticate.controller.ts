import type { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";

import { InvalidCredentialsError } from "../useCases/errors/invalid-credentials.error";

import { makeAuthenticateUseCase } from "../useCases/factories/make-authenticate-useCase.factory";

export async function authenticate(req: FastifyRequest, rep: FastifyReply) {
	const authenticateBodySchema = z.object({
		email: z.email(),
		password: z.string().min(6),
	});

	const { email, password } = authenticateBodySchema.parse(req.body);

	try {
		const authenticateUseCase = makeAuthenticateUseCase();

		const { user } = await authenticateUseCase.execute({ email, password });

		const token = await rep.jwtSign(
			{},
			{
				sign: {
					sub: user.id,
				},
			},
		);

		return rep.status(200).send({ token });
	} catch (error) {
		if (error instanceof InvalidCredentialsError) {
			return rep.status(409).send({ messageError: error.message });
		}

		throw error;
	}
}
