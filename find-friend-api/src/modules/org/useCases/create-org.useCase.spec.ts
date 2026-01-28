import { describe, it, beforeEach } from "vitest"

import { OrgsRepositoryInMemory } from "../repositories/in-memory/in-memory-orgs.repository"

import { CreateOrgUseCase } from "./create-org.useCase"


describe("Create Organization (Org)", () => {
    let orgsRepositoryInMemory: OrgsRepositoryInMemory

    let createOrgUseCase: CreateOrgUseCase

    beforeEach(() => {
        orgsRepositoryInMemory = new OrgsRepositoryInMemory()

        createOrgUseCase = new CreateOrgUseCase(orgsRepositoryInMemory)
    })

    it("should be able create a organization", async () => {
        
    })
})