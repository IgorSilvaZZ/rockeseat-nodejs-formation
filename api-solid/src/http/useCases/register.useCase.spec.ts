import { describe, it, expect } from "vitest";
import { compare } from "bcryptjs";

import { InMemoryUsersRepository } from "../repositories/in-memory/in-memory-users-repository";

import { RegisterUserUseCase } from "./register.useCase";
import { UserAlreadyExistsError } from "./errors/user-already-exists.error";

describe("Register User Use Case", () => {
  it("Should be able to register new user", async () => {
    const inMemoryUsersRepository = new InMemoryUsersRepository();

    const registerUserUseCase = new RegisterUserUseCase(
      inMemoryUsersRepository
    );

    const { user } = await registerUserUseCase.execute({
      name: "User test",
      email: "user@test.com",
      password: "123",
    });

    expect(user).toHaveProperty("id");
    expect(user.id).toEqual(expect.any(String));
  });

  it("Should be able hash password upon registration user", async () => {
    const inMemoryUsersRepository = new InMemoryUsersRepository();

    const registerUserUseCase = new RegisterUserUseCase(
      inMemoryUsersRepository
    );

    const passwordUser = "123";

    const { user } = await registerUserUseCase.execute({
      name: "User test",
      email: "user@test.com",
      password: passwordUser,
    });

    const isPasswordCorrectlyHashed = await compare(
      passwordUser,
      user.passwordHash
    );

    expect(isPasswordCorrectlyHashed).toBe(true);
  });

  it("Should not be able to register with same email twice", async () => {
    const inMemoryUsersRepository = new InMemoryUsersRepository();

    const registerUserUseCase = new RegisterUserUseCase(
      inMemoryUsersRepository
    );

    const emailUser = "user@test.com";

    await registerUserUseCase.execute({
      name: "User test",
      email: emailUser,
      password: "123",
    });

    await expect(() => {
      return registerUserUseCase.execute({
        name: "User test 2",
        email: emailUser,
        password: "123456",
      });
    }).rejects.toBeInstanceOf(UserAlreadyExistsError);
  });
});
