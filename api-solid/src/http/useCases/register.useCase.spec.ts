import { compare } from "bcryptjs";
import { beforeEach, describe, expect, it } from "vitest";

import { InMemoryUsersRepository } from "../repositories/in-memory/in-memory-users-repository";
import { UserAlreadyExistsError } from "./errors/user-already-exists.error";
import { RegisterUserUseCase } from "./register.useCase";

describe("Register User Use Case", () => {
	let inMemoryUsersRepository: InMemoryUsersRepository;
	let registerUserUseCase: RegisterUserUseCase;

	beforeEach(() => {
		inMemoryUsersRepository = new InMemoryUsersRepository();

		registerUserUseCase = new RegisterUserUseCase(inMemoryUsersRepository);
	});

	it("Should be able to register new user", async () => {
		const { user } = await registerUserUseCase.execute({
			name: "User test",
			email: "user@test.com",
			password: "123",
		});

		expect(user).toHaveProperty("id");
		expect(user.id).toEqual(expect.any(String));
	});

	it("Should be able hash password upon registration user", async () => {
		const passwordUser = "123";

		const { user } = await registerUserUseCase.execute({
			name: "User test",
			email: "user@test.com",
			password: passwordUser,
		});

		const isPasswordCorrectlyHashed = await compare(
			passwordUser,
			user.passwordHash,
		);

		expect(isPasswordCorrectlyHashed).toBe(true);
	});

	it("Should not be able to register with same email twice", async () => {
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
