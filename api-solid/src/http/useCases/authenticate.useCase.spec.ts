import { describe, it, expect, beforeEach } from "vitest";
import { hash } from "bcryptjs";

import { InMemoryUsersRepository } from "../repositories/in-memory/in-memory-users-repository";

import { InvalidCredentialsError } from "./errors/invalid-credentials.error";

import { AuthenticateUseCase } from "./authenticate.useCase";

describe("Authenticate Use Case", () => {
  let usersRepositoryInMemory: InMemoryUsersRepository;
  let authenticateUseCase: AuthenticateUseCase;

  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository();

    authenticateUseCase = new AuthenticateUseCase(usersRepositoryInMemory);
  });

  it("Should be able to authenticate", async () => {
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
    await expect(() => {
      return authenticateUseCase.execute({
        email: "user123@test.com",
        password: "123",
      });
    }).rejects.toBeInstanceOf(InvalidCredentialsError);
  });

  it("Should no be able to authenticate with wrong password", async () => {
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
