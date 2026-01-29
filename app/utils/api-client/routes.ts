import apiV1Account from "@/routes/api/v1/account";
import apiV1Login from "@/routes/api/v1/login";
import apiV1Logout from "@/routes/api/v1/logout";
import apiV1PasswordChange from "@/routes/api/v1/password-change";
import apiV1PasswordReset from "@/routes/api/v1/password-reset";
import apiV1PasswordResetVerify from "@/routes/api/v1/password-reset/verify";
import apiV1Signup from "@/routes/api/v1/signup";
import apiV1SignupVerify from "@/routes/api/v1/signup/verify";
import { createHonoApp } from "@/utils/factory/hono";

const apiRoutes = createHonoApp()
	.route("/api/v1/account", apiV1Account)
	.route("/api/v1/login", apiV1Login)
	.route("/api/v1/logout", apiV1Logout)
	.route("/api/v1/password-change", apiV1PasswordChange)
	.route("/api/v1/password-reset", apiV1PasswordReset)
	.route("/api/v1/password-reset/verify", apiV1PasswordResetVerify)
	.route("/api/v1/signup", apiV1Signup)
	.route("/api/v1/signup/verify", apiV1SignupVerify);

export type ApiRoutes = typeof apiRoutes;
