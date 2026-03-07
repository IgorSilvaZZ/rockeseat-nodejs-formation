import type { FastifyInstance } from "fastify";
import { verifyJwt } from "@/http/middlewares/verify-jwt.middleware";
import { create } from "./create.controller";
import { get } from "./get.controller";
import { search } from "./search.controller";

export async function petsRoutes(app: FastifyInstance) {
	app.get("/pets", search);

	app.get("/pets/:id", get);

	app.post("/pets", { onRequest: verifyJwt }, create);
}
