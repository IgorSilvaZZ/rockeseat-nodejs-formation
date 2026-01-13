import type { FastifyInstance } from "fastify";
import request from "supertest";

export async function createAndAuthenticateUser(app: FastifyInstance) {
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

	return { token };
}
