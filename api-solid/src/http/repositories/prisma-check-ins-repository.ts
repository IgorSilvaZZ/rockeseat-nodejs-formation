import type { CheckIn, Prisma } from "@prisma/client";
import dayjs from "dayjs";
import { prisma } from "@/lib/prisma";
import type { CheckInsRepository } from "./check-ins-repository";

export class PrismaCheckInsRepository implements CheckInsRepository {
	async findById(id: string): Promise<CheckIn | null> {
		const checkIn = await prisma.checkIn.findUnique({
			where: { id },
		});

		return checkIn;
	}

	async findByUserIdOnDate(
		userId: string,
		date: Date,
	): Promise<CheckIn | null> {
		const startOfTheDay = dayjs(date).startOf("date"); // Começo do dia

		const endOfTheDay = dayjs(date).endOf("date"); // Fim do dia

		const checkIn = await prisma.checkIn.findFirst({
			where: {
				userId,
				createdAt: {
					gte: startOfTheDay.toDate(), // Maior que ou igual
					lte: endOfTheDay.toDate(), // Menor que ou igual
				},
			},
		});

		return checkIn;
	}

	async findManyByUserId(userId: string, page: number): Promise<CheckIn[]> {
		const checkIns = await prisma.checkIn.findMany({
			where: { userId },
			take: 20, // Quantos registros quero trazer
			skip: (page - 1) * 20, // Quantos registros eu quero pular
		});

		return checkIns;
	}

	async countByUserId(userId: string): Promise<number> {
		const count = await prisma.checkIn.count({
			where: { userId },
		});

		return count;
	}

	async create(data: Prisma.CheckInUncheckedCreateInput): Promise<CheckIn> {
		const checkIn = await prisma.checkIn.create({
			data,
		});

		return checkIn;
	}

	async save(data: CheckIn): Promise<CheckIn> {
		const checkIn = await prisma.checkIn.update({
			where: { id: data.id },
			data,
		});

		return checkIn;
	}
}
