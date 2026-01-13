import request from "supertest";
import { beforeAll, describe, expect, it } from "vitest";

import { app } from "@/app";

import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";

describe("Create Gym (e2e)", () => {
	beforeAll(async () => {
		await app.ready();
	});

	it("should be able to create a gym", async () => {
		const { token } = await createAndAuthenticateUser(app);

		const response = await request(app.server)
			.post("/gyms")
			.set("Authorization", `Bearer ${token}`)
			.send({
				title: "Academia Slim",
				description: "Academia Slim description",
				latitude: -23.5092646,
				longitude: -46.4514587,
				phone: "",
			});

		expect(response.statusCode).toEqual(201);
	});
});
