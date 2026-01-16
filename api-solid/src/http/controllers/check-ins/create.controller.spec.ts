import request from "supertest";
import { beforeAll, describe, expect, it } from "vitest";

import { app } from "@/app";
import { prisma } from "@/lib/prisma";
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";

describe("Create Check-In (e2e)", () => {
	beforeAll(async () => {
		await app.ready();
	});

	it("should be able to create a check-in", async () => {
		const { token } = await createAndAuthenticateUser(app);

		const { id: gymId } = await prisma.gym.create({
			data: {
				title: "Academia Slim",
				description: "Academia Slim description",
				latitude: -23.5092646,
				longitude: -46.4514587,
				phone: "",
			},
		});

		const response = await request(app.server)
			.post(`/gyms/${gymId}/check-ins`)
			.set("Authorization", `Bearer ${token}`)
			.send({
				latitude: -23.5096754,
				longitude: -46.4515441,
			});

		expect(response.statusCode).toEqual(201);
	});
});
