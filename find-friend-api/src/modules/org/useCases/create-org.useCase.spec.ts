import { beforeEach, describe, expect, it } from "vitest";
import { makeOrgMock } from "@/utils/test/mocks/mock-org";
import { OrgAlreadyExistsError } from "../errors/OrgAlreadyExistsError";
import { OrgsRepositoryInMemory } from "../repositories/in-memory/in-memory-orgs.repository";
import { CreateOrgUseCase } from "./create-org.useCase";

describe("Create Organization (Org)", () => {
	let orgsRepositoryInMemory: OrgsRepositoryInMemory;

	let createOrgUseCase: CreateOrgUseCase;

	beforeEach(() => {
		orgsRepositoryInMemory = new OrgsRepositoryInMemory();

		createOrgUseCase = new CreateOrgUseCase(orgsRepositoryInMemory);
	});

	it("should be able create a organization", async () => {
		const orgData = makeOrgMock();

		const { org } = await createOrgUseCase.execute(orgData);

		expect(org).toHaveProperty("id");
		expect(org.id).toEqual(expect.any(String));
	});

	it("should not able create a organization with emails equals!", async () => {
		const emailOrg = "org@email.com";

		await createOrgUseCase.execute(makeOrgMock({ email: emailOrg }));

		await expect(() => {
			return createOrgUseCase.execute(makeOrgMock({ email: emailOrg }));
		}).rejects.toBeInstanceOf(OrgAlreadyExistsError);
	});
});
