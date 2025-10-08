import { PrismaUsersRepository } from "@/http/repositories/prisma-users-repository";

import { AuthenticateUseCase } from "../authenticate.useCase";

export const makeAuthenticateUseCase = () => {
  const prismaUsersRepository = new PrismaUsersRepository();

  const authenticateUseCase = new AuthenticateUseCase(prismaUsersRepository);

  return authenticateUseCase;
};
