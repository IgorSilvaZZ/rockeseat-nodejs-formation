import type { FastifyInstance } from "fastify";

import { authenticate } from "./controllers/authenticate.controller";
import { profile } from "./controllers/profile.controller";
import { register } from "./controllers/register.controller";

export async function appRoutes(app: FastifyInstance) {
	app.post("/users", register);
	app.post("/sessions", authenticate);

	/* Authenticated routes */
	app.post("/me", profile);
}
