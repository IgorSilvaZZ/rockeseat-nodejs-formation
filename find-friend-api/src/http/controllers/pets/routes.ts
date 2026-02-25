import type { FastifyInstance } from "fastify";
import { create } from "./create.controller";

export async function petsRoutes(app: FastifyInstance) {
	app.post("/pets", create);
}
