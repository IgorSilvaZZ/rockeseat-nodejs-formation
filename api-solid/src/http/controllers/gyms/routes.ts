import type { FastifyInstance } from "fastify";
import { verifyRoleUser } from "@/http/middlewares/verify-user-role";
import { verifyJWT } from "../../middlewares/verify-jwt.middleware";
import { create } from "./create.controller";
import { nearby } from "./nearby.controller";
import { search } from "./search.controller";

export async function gymsRoutes(app: FastifyInstance) {
	app.addHook("onRequest", verifyJWT);

	app.get("/gyms/search", search);
	app.get("/gyms/nearby", nearby);

	app.post("/gyms", { onRequest: [verifyRoleUser("ADMIN")] }, create);
}
