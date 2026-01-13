import request from "supertest";
import { beforeAll, describe, expect, it } from "vitest";

import { app } from "@/app";

import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";

describe("Search Gyms (e2e)", () => {
	beforeAll(async () => {
		await app.ready();
	});

	it("should be able to search a gym", async () => {
		const { token } = await createAndAuthenticateUser(app);

		await request(app.server)
			.post("/gyms")
			.set("Authorization", `Bearer ${token}`)
			.send({
				title: "Academia Slim",
				description: "Academia Slim description",
				latitude: -23.5092646,
				longitude: -46.4514587,
				phone: "",
			});

		await request(app.server)
			.post("/gyms")
			.set("Authorization", `Bearer ${token}`)
			.send({
				title: "New Open",
				description: "New Open description",
				latitude: -23.5092646,
				longitude: -46.4514587,
				phone: "",
			});

		const response = await request(app.server)
			.get("/gyms/search")
			.query({
				q: "New Open",
			})
			.set("Authorization", `Bearer ${token}`)
			.send();

		expect(response.statusCode).toEqual(200);
		expect(response.body.gyms).toHaveLength(1);
		expect(response.body.gyms).toEqual([
			expect.objectContaining({
				title: "New Open",
			}),
		]);
	});
});
