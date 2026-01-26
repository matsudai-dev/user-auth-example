import { type AuthenticatedEnv, type Context, type Env, Hono } from "hono";
import { createRoute } from "honox/factory";
import { authMiddleware } from "@/middlewares/auth";
import { getLoginRedirectUrl } from "@/utils/url";

export function createHonoApp(): Hono<Env> {
	return new Hono<Env>();
}

type AuthenticatedRouteHandler = (
	c: Context<AuthenticatedEnv>,
) => Response | Promise<Response>;

const loginRequiredPage = authMiddleware<AuthenticatedEnv>((result, c) => {
	if (!result.success) {
		return c.redirect(getLoginRedirectUrl(c.req.path));
	}
});

/**
 * Creates an authenticated page route with login redirect on auth failure.
 * Automatically applies auth middleware and ensures user is available in context.
 *
 * @param handler - Route handler that receives authenticated context
 * @returns HonoX route with auth middleware applied
 *
 * @example
 * export default createAuthenticatedRoute((c) => {
 *   const user = c.get("user");
 *   return c.render(<div>Hello, {user.email}</div>);
 * });
 */
export const createAuthenticatedRoute = (
	handler: AuthenticatedRouteHandler,
) => {
	return createRoute(loginRequiredPage, handler);
};
