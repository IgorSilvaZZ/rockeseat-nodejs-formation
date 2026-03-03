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

		await orgsRepositoryInMemory.create(orgData);

		const { org } = await authenticateUseCase.execute({
			email: orgData.email,
			password: "123",
		});

		expect(org.id).toEqual(expect.any(String));
	});

	it("should not be able authenticate a organization when incorrect email", async () => {
		const orgData = makeOrgMock({ password: await hash("123", 10) });

		await orgsRepositoryInMemory.create(orgData);

		await expect(() =>
			authenticateUseCase.execute({
				email: "invalid-email",
				password: "123",
			}),
		).rejects.toBeInstanceOf(InvalidCredentialsError);
	});

	it("should not be able authenticate a organization when incorrect password", async () => {
		const orgData = makeOrgMock({ password: await hash("123", 10) });

		await orgsRepositoryInMemory.create(orgData);

		await expect(() =>
			authenticateUseCase.execute({
				email: orgData.email,
				password: "other-password",
			}),
		).rejects.toBeInstanceOf(InvalidCredentialsError);
	});
});
