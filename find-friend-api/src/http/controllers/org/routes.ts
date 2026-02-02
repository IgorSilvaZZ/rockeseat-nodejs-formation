import type { FastifyInstance } from "fastify";
import { authenticate } from "./authenticate.controller";
import { create } from "./create.controller";

export async function orgsRoutes(app: FastifyInstance) {
	app.post("/orgs", create);
	app.post("/sessions", authenticate);
}
