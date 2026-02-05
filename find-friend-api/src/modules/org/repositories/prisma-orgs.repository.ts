import type { Org, Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import type { OrgsRepository } from "./orgs.repository";

export class PrismaOrgsRepository implements OrgsRepository {
	async findById(id: string): Promise<Org | null> {
		const org = await prisma.org.findFirst({
			where: {
				id,
			},
		});

		return org ?? null;
	}

	async findByEmail(email: string): Promise<Org | null> {
		const org = await prisma.org.findUnique({
			where: { email },
		});

		return org ?? null;
	}

	async create(data: Prisma.OrgCreateInput): Promise<Org> {
		const org = await prisma.org.create({
			data,
		});

		return org;
	}
}
