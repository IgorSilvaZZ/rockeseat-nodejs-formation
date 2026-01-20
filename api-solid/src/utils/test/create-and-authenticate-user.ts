import { hash } from "bcryptjs";
import type { FastifyInstance } from "fastify";
import request from "supertest";
import { prisma } from "@/lib/prisma";

export async function createAndAuthenticateUser(
	app: FastifyInstance,
	isAdmin = false,
) {
	await prisma.user.create({
		data: {
			name: "Igor Silva",
			email: "igor@email.com",
			passwordHash: await hash("senha123", 6),
			role: isAdmin ? "ADMIN" : "MEMBER",
		},
	});

	const authResponse = await request(app.server).post("/sessions").send({
		email: "igor@email.com",
		password: "senha123",
	});

	const { token } = authResponse.body;

	return { token };
}
