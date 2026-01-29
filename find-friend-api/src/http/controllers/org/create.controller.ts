import type { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { makeCreateOrgUseCase } from "@/modules/org/factories/make-create-org-useCase.factory";

export async function create(req: FastifyRequest, rep: FastifyReply) {
	const createOrgSchema = z.object({
		name: z.string().min(1).max(250),
		email: z.email(),
		phone: z.string().min(1),
		password: z.string().min(1),
		address: z.object({
			cep: z.string(),
			street: z.string(),
			neighborhood: z.string(),
			number: z.string(),
			city: z.string(),
			state: z.string(),
		}),
	});

	const orgData = createOrgSchema.parse(req.body);

	const createOrgUseCase = makeCreateOrgUseCase();

	await createOrgUseCase.execute(orgData);

	return rep.status(201).send();
}
