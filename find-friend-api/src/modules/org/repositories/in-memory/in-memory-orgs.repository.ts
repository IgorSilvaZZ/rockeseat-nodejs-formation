import { randomUUID } from "node:crypto";
import { Org, Prisma } from "@prisma/client";
import { OrgsRepository } from "../orgs.repository";
import { Decimal } from "@prisma/client/runtime/library";


export class OrgsRepositoryInMemory implements OrgsRepository {
    public orgs: Org[] = []

    async findByEmail(email: string): Promise<Org | null> {
        const org = this.orgs.find(item => item.email === email)

        return org || null
    }

    async create(data: Prisma.OrgCreateInput): Promise<Org> {
        const org = {
            ...data,
            id: data.id ?? randomUUID(),
            latitude: new Decimal(data.latitude.toString()),
            longitude: new Decimal(data.longitude.toString()),
            createdAt: new Date()
        }

        this.orgs.push(org)

        return org
    }

}