import { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";

import { PrismaUsersRepository } from "../repositories/prisma-users-repository";

import { InvalidCredentialsError } from "../useCases/errors/invalid-credentials.error";

import { AuthenticateUseCase } from "../useCases/authenticate.useCase";

export async function authenticate(req: FastifyRequest, rep: FastifyReply) {
  const authenticateBodySchema = z.object({
    email: z.email(),
    password: z.string().min(6),
  });

  const { email, password } = authenticateBodySchema.parse(req.body);

  try {
    const prismaUsersRepository = new PrismaUsersRepository();

    const authenticateUseCase = new AuthenticateUseCase(prismaUsersRepository);

    const { user } = await authenticateUseCase.execute({ email, password });

    return rep.status(200).send(user);
  } catch (error) {
    if (error instanceof InvalidCredentialsError) {
      return rep.status(409).send({ messageError: error.message });
    }

    throw error;
  }
}
