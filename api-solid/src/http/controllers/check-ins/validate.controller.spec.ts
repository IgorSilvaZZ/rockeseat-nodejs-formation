import request from "supertest";
import { beforeAll, describe, expect, it } from "vitest";

import { app } from "@/app";
import { prisma } from "@/lib/prisma";
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";

describe("Validate Check-In (e2e)", () => {
	beforeAll(async () => {
		await app.ready();
	});

	it("should be able to validate a check-in", async () => {
		const { token } = await createAndAuthenticateUser(app, true);

		const user = await prisma.user.findFirstOrThrow();

		const { id: gymId } = await prisma.gym.create({
			data: {
				title: "Academia Slim",
				description: "Academia Slim description",
				latitude: -23.5092646,
				longitude: -46.4514587,
				phone: "",
			},
		});

		let checkIn = await prisma.checkIn.create({
			data: {
				gymId: gymId,
				userId: user.id,
			},
		});

		const response = await request(app.server)
			.patch(`/check-ins/${checkIn.id}/validate`)
			.set("Authorization", `Bearer ${token}`)
			.send();

		expect(response.statusCode).toEqual(204);

		checkIn = await prisma.checkIn.findUniqueOrThrow({
			where: {
				id: checkIn.id,
			},
		});

		expect(checkIn.validatedAt).toEqual(expect.any(Date));
	});
});
