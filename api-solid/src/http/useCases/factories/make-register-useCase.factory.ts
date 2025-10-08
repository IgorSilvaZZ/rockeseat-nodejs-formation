import { PrismaUsersRepository } from "@/http/repositories/prisma-users-repository";

import { RegisterUserUseCase } from "../register.useCase";

export const makeRegisterUserUseCase = () => {
  const prismaUsersRepository = new PrismaUsersRepository();

  const registerUserUserCase = new RegisterUserUseCase(prismaUsersRepository);

  return registerUserUserCase;
};
