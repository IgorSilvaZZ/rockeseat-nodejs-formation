import { randomUUID } from "node:crypto";
import type { Gym, Prisma } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";
import { getDistanceBetweenCoordinates } from "@/utils/get-distance-between-coordinates";
import type { FindManyNearbyParams, GymsRepository } from "../gyms.repository";

export class InMemoryGymsRepository implements GymsRepository {
	public allGym: Gym[] = [];

	async findById(id: string): Promise<Gym | null> {
		const gym = this.allGym.find((item) => item.id === id);

		if (!gym) {
			return null;
		}

		return gym;
	}

	async searchMany(query: string, page: number): Promise<Gym[]> {
		return this.allGym
			.filter((item) => item.title.includes(query))
			.slice((page - 1) * 20, page * 20);
	}

	async findManyNearby(params: FindManyNearbyParams): Promise<Gym[]> {
		return this.allGym.filter((gym) => {
			const distance = getDistanceBetweenCoordinates(
				{ latitude: params.latitude, longitude: params.longitude },
				{
					latitude: gym.latitude.toNumber(),
					longitude: gym.longitude.toNumber(),
				},
			);

			return distance < 10;
		});
	}

	async create(data: Prisma.GymCreateInput): Promise<Gym> {
		const gym = {
			id: data.id ?? randomUUID(),
			title: data.title,
			description: data.description ?? null,
			phone: data.phone ?? null,
			latitude: new Decimal(data.latitude.toString()),
			longitude: new Decimal(data.longitude.toString()),
			createdAt: new Date(),
		};

		this.allGym.push(gym);

		return gym;
	}
}
