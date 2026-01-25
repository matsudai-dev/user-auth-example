import apiV1Login from "@/routes/api/v1/login";
import apiV1Signup from "@/routes/api/v1/signup";
import apiV1SignupVerify from "@/routes/api/v1/signup/verify";
import { createHonoApp } from "@/utils/factory/hono";

const apiRoutes = createHonoApp()
	.route("/api/v1/login", apiV1Login)
	.route("/api/v1/signup", apiV1Signup)
	.route("/api/v1/signup/verify", apiV1SignupVerify);

export type ApiRoutes = typeof apiRoutes;
