import apiV1Signup from "@/routes/api/v1/signup";
import { createHonoApp } from "@/utils/factory/hono";

const apiRoutes = createHonoApp().route("/api/v1/signup", apiV1Signup);

export type ApiRoutes = typeof apiRoutes;
