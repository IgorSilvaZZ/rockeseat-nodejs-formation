import { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";

import { UserAlreadyExistsError } from "../useCases/errors/user-already-exists.error";

import { makeRegisterUserUseCase } from "../useCases/factories/make-register-useCase.factory";

export async function register(req: FastifyRequest, rep: FastifyReply) {
  const registerBodySchema = z.object({
    name: z.string(),
    email: z.email(),
    password: z.string().min(6),
  });

  const { name, email, password } = registerBodySchema.parse(req.body);

  try {
    const registerUserUseCase = makeRegisterUserUseCase();

    await registerUserUseCase.execute({ name, email, password });
  } catch (error) {
    if (error instanceof UserAlreadyExistsError) {
      return rep.status(409).send({ messageError: error.message });
    }

    throw error;
  }

  return rep.status(201).send();
}
