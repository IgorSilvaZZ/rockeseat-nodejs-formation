import type { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";

import { makeNearbyGymsUseCase } from "@/http/useCases/factories/make-fetch-nearby-gyms-useCase.factory";

export async function nearby(req: FastifyRequest, rep: FastifyReply) {
	const nearbyGymsQuerySchema = z.object({
		latitude: z.coerce.number().refine((value) => {
			return Math.abs(value) <= 90;
		}),
		longitude: z.coerce.number().refine((value) => {
			return Math.abs(value) <= 180;
		}),
	});

	const { latitude, longitude } = nearbyGymsQuerySchema.parse(req.query);

	const fetchNearbyGymsUseCase = makeNearbyGymsUseCase();

	const { gyms } = await fetchNearbyGymsUseCase.execute({
		userLatitude: latitude,
		userLongitude: longitude,
	});

	return rep.status(200).send({
		gyms,
	});
}
