import fastifyJwt from "@fastify/jwt";
import multipart from "@fastify/multipart";
import fastify from "fastify";
import { ZodError } from "zod";
import { env } from "@/env";
import { orgsRoutes } from "./controllers/org/routes";
import { petsRoutes } from "./controllers/pets/routes";

export const app = fastify();

app.register(fastifyJwt, {
	secret: env.JWT_SECRET,
});

app.register(multipart);

app.register(orgsRoutes);
app.register(petsRoutes);

app.setErrorHandler((error, _, reply) => {
	console.error(error);

	if (error instanceof ZodError) {
		return reply
			.status(400)
			.send({ message: "Validation error", issues: error.format() });
	}

	return reply.status(500).send({ message: "Internal server error." });
});
