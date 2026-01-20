import fastifyCookie from "@fastify/cookie";
import fastifyJwt from "@fastify/jwt";
import fastify from "fastify";

import { ZodError } from "zod";

import { env } from "./env";
import { checkInsRoutes } from "./http/controllers/check-ins/routes";
import { gymsRoutes } from "./http/controllers/gyms/routes";
import { userRoutes } from "./http/controllers/users/routes";

export const app = fastify();

app.register(fastifyCookie);
app.register(fastifyJwt, {
	secret: env.JWT_SECRET,
	cookie: {
		cookieName: "refreshToken",
		signed: false /* Nao precisa validar a assinatura do refreshToken */,
	},
	sign: {
		expiresIn: "10m",
	},
});

app.register(userRoutes);
app.register(gymsRoutes);
app.register(checkInsRoutes);

app.setErrorHandler((error, _, reply) => {
	if (error instanceof ZodError) {
		return reply
			.status(400)
			.send({ message: "Validation error", issues: error.format() });
	}

	if (env.NODE_ENV !== "production") {
		console.error(error);
	}

	// Em produção usar uma ferramenta de observabilidade

	return reply.status(500).send({ message: "Internal server error." });
});
