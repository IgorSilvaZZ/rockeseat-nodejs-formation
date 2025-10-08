import { describe, it, expect, beforeEach } from "vitest";
import { hash } from "bcryptjs";

import { InMemoryUsersRepository } from "../repositories/in-memory/in-memory-users-repository";

import { AuthenticateUseCase } from "./authenticate.useCase";
import { GetUserProfileUseCase } from "./get-user-profile.useCase";
import { ResourceNotFoundError } from "./errors/resource-not-found.error";

describe("Get User Profile Use Case", () => {
  let usersRepositoryInMemory: InMemoryUsersRepository;
  let getUserProfileUseCase: GetUserProfileUseCase;

  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository();

    getUserProfileUseCase = new GetUserProfileUseCase(usersRepositoryInMemory);
  });

  it("Should be able to get user profile", async () => {
    const newUser = await usersRepositoryInMemory.create({
      name: "User test",
      email: "user@test.com",
      passwordHash: await hash("123", 6),
    });

    const { user } = await getUserProfileUseCase.execute({ id: newUser.id });

    expect(user.id).toEqual(expect.any(String));
    expect(user.name).toEqual("User test");
  });

  it("Should not be able get user profile with wrong id", async () => {
    await expect(() => {
      return getUserProfileUseCase.execute({ id: "non-existing-id" });
    }).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
