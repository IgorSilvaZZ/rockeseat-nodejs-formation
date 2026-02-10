import { hash } from "bcryptjs";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { makeOrgMock } from "@/utils/test/mocks/mock-org";
import { InvalidCredentialsError } from "../errors/InvalidCredentialsError";
import { OrgsRepositoryInMemory } from "../repositories/in-memory/in-memory-orgs.repository";
import { AuthenticateUseCase } from "./authenticate.useCase";

describe("Authenticate Organization (Org)", () => {
	let orgsRepositoryInMemory: OrgsRepositoryInMemory;

	let authenticateUseCase: AuthenticateUseCase;

	beforeEach(() => {
		orgsRepositoryInMemory = new OrgsRepositoryInMemory();

		authenticateUseCase = new AuthenticateUseCase(orgsRepositoryInMemory);
	});

	it("should be able authenticate a organization", async () => {
		const orgData = makeOrgMock({ password: await hash("123", 10) });

		await orgsRepositoryInMemory.create({
			name: orgData.name,
			email: orgData.email,
			passwordHash: orgData.password,
			phone: orgData.phone,
			street: orgData.address.street,
			cep: orgData.address.cep,
			city: orgData.address.city,
			neighborhood: orgData.address.neighborhood,
			number: orgData.address.number,
			state: orgData.address.state,
		});

		const { org } = await authenticateUseCase.execute({
			email: orgData.email,
			password: "123",
		});

		expect(org.id).toEqual(expect.any(String));
	});

	it("should not be able authenticate a organization when incorrect email", async () => {
		const orgData = makeOrgMock({ password: await hash("123", 10) });

		await orgsRepositoryInMemory.create({
			name: orgData.name,
			email: orgData.email,
			passwordHash: orgData.password,
			phone: orgData.phone,
			street: orgData.address.street,
			cep: orgData.address.cep,
			city: orgData.address.city,
			neighborhood: orgData.address.neighborhood,
			number: orgData.address.number,
			state: orgData.address.state,
		});

		await expect(() =>
			authenticateUseCase.execute({
				email: "invalid-email",
				password: "123",
			}),
		).rejects.toBeInstanceOf(InvalidCredentialsError);
	});

	it("should not be able authenticate a organization when incorrect password", async () => {
		const orgData = makeOrgMock({ password: await hash("123", 10) });

		await orgsRepositoryInMemory.create({
			name: orgData.name,
			email: orgData.email,
			passwordHash: orgData.password,
			phone: orgData.phone,
			street: orgData.address.street,
			cep: orgData.address.cep,
			city: orgData.address.city,
			neighborhood: orgData.address.neighborhood,
			number: orgData.address.number,
			state: orgData.address.state,
		});

		await expect(() =>
			authenticateUseCase.execute({
				email: orgData.email,
				password: "other-password",
			}),
		).rejects.toBeInstanceOf(InvalidCredentialsError);
	});
});
