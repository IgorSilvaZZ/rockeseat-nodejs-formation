import request from "supertest";
import { beforeAll, describe, expect, it } from "vitest";

import { app } from "@/app";
import { prisma } from "@/lib/prisma";
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";

describe("Check-In History (e2e)", () => {
	beforeAll(async () => {
		await app.ready();
	});

	it("should be able to list the history of check-ins", async () => {
		const { token } = await createAndAuthenticateUser(app);

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

		await prisma.checkIn.createMany({
			data: [
				{
					gymId: gymId,
					userId: user.id,
				},
				{
					gymId: gymId,
					userId: user.id,
				},
			],
		});

		const response = await request(app.server)
			.get(`/check-ins/history`)
			.set("Authorization", `Bearer ${token}`)
			.send();

		expect(response.statusCode).toEqual(200);
		expect(response.body.checkIns).toHaveLength(2);
		expect(response.body.checkIns).toEqual([
			expect.objectContaining({
				gymId: gymId,
				userId: user.id,
			}),
			expect.objectContaining({
				gymId: gymId,
				userId: user.id,
			}),
		]);
	});
});
