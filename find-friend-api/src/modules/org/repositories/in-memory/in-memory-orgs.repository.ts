import { randomUUID } from "node:crypto";
import type { Org, Prisma } from "@prisma/client";
import type { OrgsRepository } from "../orgs.repository";

export class OrgsRepositoryInMemory implements OrgsRepository {
	public orgs: Org[] = [];

	async findById(id: string): Promise<Org | null> {
		const org = this.orgs.find((item) => item.id === id);

		return org || null;
	}

	async findByEmail(email: string): Promise<Org | null> {
		const org = this.orgs.find((item) => item.email === email);

		return org || null;
	}

	async create(data: Prisma.OrgCreateInput): Promise<Org> {
		const org = {
			...data,
			id: data.id ?? randomUUID(),
			createdAt: new Date(),
		};

		this.orgs.push(org);

		return org;
	}
}
