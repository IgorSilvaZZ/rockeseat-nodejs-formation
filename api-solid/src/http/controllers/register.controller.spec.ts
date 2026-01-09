import request from "supertest";
import { beforeAll, describe, expect, it } from "vitest";

import { app } from "@/app";

describe("Register (e2e)", () => {
	beforeAll(async () => {
		await app.ready();
	});

	it("should be able to register", async () => {
		const response = await request(app.server).post("/users").send({
			name: "Igor Silva",
			email: "igor@email.com",
			password: "senha123",
		});

		expect(response.statusCode).toEqual(201);
	});
});
