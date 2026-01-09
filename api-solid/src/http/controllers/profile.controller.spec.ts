import request from "supertest";
import { beforeAll, describe, expect, it } from "vitest";

import { app } from "@/app";

describe("Profile (e2e)", () => {
	beforeAll(async () => {
		await app.ready();
	});

	it("should be able to get user profile", async () => {
		await request(app.server).post("/users").send({
			name: "Igor Silva",
			email: "igor@email.com",
			password: "senha123",
		});

		const authResponse = await request(app.server).post("/sessions").send({
			email: "igor@email.com",
			password: "senha123",
		});

		const { token } = authResponse.body;

		const profileResponse = await request(app.server)
			.get("/me")
			.set("Authorization", `Bearer ${token}`)
			.send();

		expect(profileResponse.statusCode).toEqual(200);
		expect(profileResponse.body.user).toEqual(
			expect.objectContaining({ email: "igor@email.com" }),
		);
	});
});
