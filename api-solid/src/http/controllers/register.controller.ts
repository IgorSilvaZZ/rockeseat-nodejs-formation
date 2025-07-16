import { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";

import { prisma } from "@/lib/prisma";

export async function register(req: FastifyRequest, rep: FastifyReply) {
  const registerBodySchema = z.object({
    name: z.string(),
    email: z.email(),
    password: z.string().min(6),
  });

  const { name, email, password } = registerBodySchema.parse(req.body);

  await prisma.user.create({
    data: {
      name,
      email,
      passwordHash: password,
    },
  });

  return rep.status(201).send();
}
