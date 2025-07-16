import { FastifyReply, FastifyRequest } from "fastify";
import { hash } from "bcryptjs";
import z from "zod";

import { prisma } from "@/lib/prisma";

export async function register(req: FastifyRequest, rep: FastifyReply) {
  const registerBodySchema = z.object({
    name: z.string(),
    email: z.email(),
    password: z.string().min(6),
  });

  const { name, email, password } = registerBodySchema.parse(req.body);

  const userAlreadyExists = await prisma.user.findUnique({
    where: { email },
  });

  if (userAlreadyExists) {
    return rep.status(409).send({ message: "User already exists!" });
  }

  const passwordHash = await hash(password, 6);

  await prisma.user.create({
    data: {
      name,
      email,
      passwordHash,
    },
  });

  return rep.status(201).send();
}
