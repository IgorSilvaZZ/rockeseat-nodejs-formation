import { Prisma, User } from "@prisma/client";

import { UsersRepository } from "./users-repository";

import { prisma } from "@/lib/prisma";

export class PrismaUsersRepository implements UsersRepository {
  async findById(id: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: { id },
    });

    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    return user;
  }

  async create({ name, email, passwordHash }: Prisma.UserCreateInput) {
    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
      },
    });

    return user;
  }
}
