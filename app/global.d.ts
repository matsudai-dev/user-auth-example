import type {} from "hono";

declare module "hono" {
	interface Env {
		Bindings: {
			DB: D1Database;
			RESEND_API_KEY: string;
			RESEND_EMAIL_FROM: string;
			GOOGLE_CLIENT_ID: string;
			GOOGLE_CLIENT_SECRET: string;
			GOOGLE_REDIRECT_URI: string;
			JWT_SECRET: string;
		};
	}
}
