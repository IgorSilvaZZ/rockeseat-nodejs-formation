import type { FastifyInstance } from "fastify";
import { create } from "./create.controller";

export async function orgsRoutes(app: FastifyInstance) {
	app.post("/orgs", create);
}
