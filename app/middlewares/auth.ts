import { eq } from "drizzle-orm";
import type { AuthenticatedEnv, Context, Env } from "hono";
import { createMiddleware } from "hono/factory";
import { UNAUTHORIZED } from "@/consts";
import { getDBClient } from "@/db/client";
import { loginSessionsTable, usersTable } from "@/db/schemas";
import {
	generateAccessToken,
	generateRefreshToken,
	getPayloadFromAccessToken,
	getRefreshTokenFromCookie,
	setAccessTokenCookie,
	setRefreshTokenCookie,
} from "@/utils/cookie";
import { hashToken } from "@/utils/crypto/server";

/** Result of authentication check passed to the hook function */
type AuthMiddlewareResult =
	| { success: false }
	| { success: true; user: { id: string; email: string } };

/** Hook function to handle authentication results */
type AuthMiddlewareHook<E extends Env> = (
	result: AuthMiddlewareResult,
	c: Context<E>,
) => Response | undefined;

/**
 * Factory function that creates an authentication middleware with custom handling.
 * Verifies the user's session via access token or refresh token and passes
 * the result to the hook function for custom response handling.
 *
 * @typeParam E - Environment type (Env for optional auth, AuthenticatedEnv for required auth)
 * @param hook - Callback function that receives auth result and context.
 *               Return a Response to short-circuit, or undefined to continue.
 * @returns Hono middleware function
 *
 * @example
 * // For API routes - return 401 on failure (user guaranteed)
 * const loginRequiredApi = authMiddleware<AuthenticatedEnv>((result, c) => {
 *   if (!result.success) return c.text("Unauthorized", 401);
 * });
 *
 * @example
 * // For page routes - redirect to login on failure (user guaranteed)
 * const loginRequiredPage = authMiddleware<AuthenticatedEnv>((result, c) => {
 *   if (!result.success) return c.redirect(getLoginRedirectUrl(c.req.path));
 * });
 *
 * @example
 * // For optional auth - continue regardless of auth status (user may be undefined)
 * const optionalAuth = authMiddleware<Env>();
 */
export const authMiddleware = <E extends Env>(
	hook: AuthMiddlewareHook<E> = () => undefined,
) => {
	return createMiddleware<E>(async (c, next) => {
		const accessTokenPayload = await getPayloadFromAccessToken(c);

		if (accessTokenPayload) {
			const user = {
				id: accessTokenPayload.sub,
				email: accessTokenPayload.email,
			};
			const hookResult = hook({ success: true, user }, c);
			if (hookResult instanceof Response) {
				return hookResult;
			}
			c.set("user", user);
			await next();
			return;
		}

		const refreshToken = await getRefreshTokenFromCookie(c);

		if (!refreshToken) {
			const hookResult = hook({ success: false }, c);
			if (hookResult instanceof Response) {
				return hookResult;
			}
			await next();
			return;
		}

		const refreshTokenHash = hashToken(refreshToken);

		const db = getDBClient(c.env.DB);

		const currentSession = await db
			.select({
				userId: loginSessionsTable.userId,
				email: usersTable.email,
			})
			.from(loginSessionsTable)
			.innerJoin(usersTable, eq(loginSessionsTable.userId, usersTable.id))
			.where(eq(loginSessionsTable.refreshTokenHash, refreshTokenHash))
			.get();

		if (!currentSession) {
			const hookResult = hook({ success: false }, c);
			if (hookResult instanceof Response) {
				return hookResult;
			}
			await next();
			return;
		}

		const accessToken = await generateAccessToken(
			currentSession.userId,
			currentSession.email,
			c.env.JWT_SECRET,
		);

		setAccessTokenCookie(c, accessToken);

		const {
			refreshToken: newRefreshToken,
			refreshTokenHash: newrefreshTokenHash,
			expiresAt: newExpiresAt,
		} = generateRefreshToken();

		await db
			.update(loginSessionsTable)
			.set({
				refreshTokenHash: newrefreshTokenHash,
				expiresAt: newExpiresAt,
			})
			.where(eq(loginSessionsTable.refreshTokenHash, refreshTokenHash));

		setRefreshTokenCookie(c, newRefreshToken);

		const user = { id: currentSession.userId, email: currentSession.email };

		const hookResult = hook({ success: true, user }, c);

		if (hookResult instanceof Response) {
			return hookResult;
		}

		c.set("user", user);

		await next();
	});
};

export const optionalAuth = authMiddleware<Env>();

export const loginRequired = authMiddleware<AuthenticatedEnv>((result, c) => {
	if (!result.success) {
		return c.text(UNAUTHORIZED, 401);
	}
});
