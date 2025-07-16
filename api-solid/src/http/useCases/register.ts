import { hash } from "bcryptjs";

import { prisma } from "@/lib/prisma";

interface RegisterUseCaseRequest {
  name: string;
  email: string;
  password: string;
}

export async function registerUseCase({
  name,
  email,
  password,
}: RegisterUseCaseRequest) {
  const userAlreadyExists = await prisma.user.findUnique({
    where: { email },
  });

  if (userAlreadyExists) {
    throw new Error("Already user exists!");
  }

  const passwordHash = await hash(password, 6);

  await prisma.user.create({
    data: {
      name,
      email,
      passwordHash,
    },
  });
}
