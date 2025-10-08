import { describe, it, expect } from "vitest";
import { hash } from "bcryptjs";

import { InMemoryUsersRepository } from "../repositories/in-memory/in-memory-users-repository";

import { InvalidCredentialsError } from "./errors/invalid-credentials.error";

import { AuthenticateUseCase } from "./authenticate.useCase";

describe("Authenticate Use Case", () => {
  it("Should be able to authenticate", async () => {
    const usersRepositoryInMemory = new InMemoryUsersRepository();

    const authenticateUseCase = new AuthenticateUseCase(
      usersRepositoryInMemory
    );

    await usersRepositoryInMemory.create({
      name: "User test",
      email: "user@test.com",
      passwordHash: await hash("123", 6),
    });

    const { user } = await authenticateUseCase.execute({
      email: "user@test.com",
      password: "123",
    });

    expect(user.id).toEqual(expect.any(String));
  });

  it("Should no be able to authenticate with wrong email", async () => {
    const usersRepositoryInMemory = new InMemoryUsersRepository();

    const authenticateUseCase = new AuthenticateUseCase(
      usersRepositoryInMemory
    );

    await expect(() => {
      return authenticateUseCase.execute({
        email: "user123@test.com",
        password: "123",
      });
    }).rejects.toBeInstanceOf(InvalidCredentialsError);
  });

  it("Should no be able to authenticate with wrong password", async () => {
    const usersRepositoryInMemory = new InMemoryUsersRepository();

    const authenticateUseCase = new AuthenticateUseCase(
      usersRepositoryInMemory
    );

    await usersRepositoryInMemory.create({
      name: "User test",
      email: "user@test.com",
      passwordHash: await hash("123", 6),
    });

    await expect(() => {
      return authenticateUseCase.execute({
        email: "user@test.com",
        password: "123567",
      });
    }).rejects.toBeInstanceOf(InvalidCredentialsError);
  });
});
