import { FastifyReply, FastifyRequest } from "fastify";
import { hash } from "bcryptjs";
import z from "zod";

import { prisma } from "@/lib/prisma";
import { registerUseCase } from "../useCases/register";

export async function register(req: FastifyRequest, rep: FastifyReply) {
  const registerBodySchema = z.object({
    name: z.string(),
    email: z.email(),
    password: z.string().min(6),
  });

  const { name, email, password } = registerBodySchema.parse(req.body);

  try {
    await registerUseCase({ name, email, password });
  } catch {
    rep.status(409).send();
  }

  return rep.status(201).send();
}
