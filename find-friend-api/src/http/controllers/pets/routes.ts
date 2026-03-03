import type { FastifyInstance } from "fastify";
import { create } from "./create.controller";
import { search } from "./search.controller";

export async function petsRoutes(app: FastifyInstance) {
	app.post("/pets", create);

	app.get("/pets", search);
}
