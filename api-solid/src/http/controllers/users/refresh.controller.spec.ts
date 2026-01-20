import request from "supertest";
import { beforeAll, describe, expect, it } from "vitest";

import { app } from "@/app";

describe("Refresh Token (e2e)", () => {
	beforeAll(async () => {
		await app.ready();
	});

	it("should be able to refresh token", async () => {
		await request(app.server).post("/users").send({
			name: "Igor Silva",
			email: "igor@email.com",
			password: "senha123",
		});

		const authResponse = await request(app.server).post("/sessions").send({
			email: "igor@email.com",
			password: "senha123",
		});

		const cookies = authResponse.get("Set-Cookie");

		const response = await request(app.server)
			.patch("/token/refresh")
			.set("Cookie", String(cookies))
			.send();

		expect(response.statusCode).toEqual(200);
		expect(response.body).toEqual({ token: expect.any(String) });
		expect(response.get("Set-Cookie")).toEqual([
			expect.stringContaining("refreshToken="),
		]);
	});
});
