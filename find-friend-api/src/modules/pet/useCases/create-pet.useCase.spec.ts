import { it } from "node:test";
import { describe } from "vitest";
import type { OrgsRepositoryInMemory } from "@/modules/org/repositories/in-memory/in-memory-orgs.repository";
import type { StorageFake } from "@/utils/test/fakes/storage-fake";
import type { PetsRepositoryInMemory } from "../repositories/in-memory/in-memory-pets.repository";

describe("Create pet", () => {
	let petsRepositoryInMemory: PetsRepositoryInMemory;
	let orgsRepositoryInMemory: OrgsRepositoryInMemory;

	let storageFake: StorageFake;

	/* Criar arquivo de mock de criação de pet */

	it("should be able create a new pet in organization", async () => {});

	it("should not be able create a new pet with organization not exists", async () => {});

	it("should be able create a new pet in organization with field photo", async () => {});
});
