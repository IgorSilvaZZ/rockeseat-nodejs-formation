import type { FastifyReply, FastifyRequest } from "fastify";
import { makeGetUserProfileUseCase } from "../useCases/factories/make-get-user-profile-useCase.factory";

export async function profile(req: FastifyRequest, rep: FastifyReply) {
	await req.jwtVerify();

	const getUserProfileUseCase = makeGetUserProfileUseCase();

	const { user } = await getUserProfileUseCase.execute({ id: req.user.sub });

	return rep.status(200).send({
		...user,
		password_hash: undefined,
	});
}
