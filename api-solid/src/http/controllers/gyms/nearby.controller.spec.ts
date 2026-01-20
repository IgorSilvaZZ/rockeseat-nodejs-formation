import request from "supertest";
import { beforeAll, describe, expect, it } from "vitest";

import { app } from "@/app";

import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";

describe("Nearby Gyms (e2e)", () => {
	beforeAll(async () => {
		await app.ready();
	});

	it("should be able to list nearby gyms", async () => {
		const { token } = await createAndAuthenticateUser(app, true);

		await request(app.server)
			.post("/gyms")
			.set("Authorization", `Bearer ${token}`)
			.send({
				title: "Academia Slim",
				description: "",
				latitude: -23.5092646,
				longitude: -46.4514587,
				phone: "",
			});

		await request(app.server)
			.post("/gyms")
			.set("Authorization", `Bearer ${token}`)
			.send({
				title: "Smart Fit Paulista",
				description: "",
				latitude: -23.5670244,
				longitude: -46.6519714,
				phone: "",
			});

		const response = await request(app.server)
			.get("/gyms/nearby")
			.query({
				latitude: -23.5096754,
				longitude: -46.4515441,
			})
			.set("Authorization", `Bearer ${token}`)
			.send();

		expect(response.statusCode).toEqual(200);
		expect(response.body.gyms).toHaveLength(1);
		expect(response.body.gyms).toEqual([
			expect.objectContaining({
				title: "Academia Slim",
			}),
		]);
	});
});
