import { sValidator } from "@hono/standard-validator";
import { eq } from "drizzle-orm";
import { z } from "zod/v4";
import {
	BAD_REQUEST,
	LOGIN_LOCK_DURATION_MS,
	LOGIN_MAX_ATTEMPTS,
	LOGIN_RATE_LIMIT_EXPIRATION_MS,
	OK,
	REFRESH_TOKEN_EXPIRATION_MS,
	TOO_MANY_REQUESTS,
	UNAUTHORIZED,
} from "@/consts";
import { getDBClient } from "@/db/client";
import {
	loginRateLimitsTable,
	loginSessionsTable,
	temporarySessionsTable,
	usersTable,
} from "@/db/schemas";
import { injectExternalErrors } from "@/middlewares/external-errors";
import {
	generateAccessToken,
	setAccessTokenCookie,
	setRefreshTokenCookie,
	setTempSessionCookie,
} from "@/utils/cookie";
import {
	generateSecureToken,
	generateUuidv7,
	hashPassword,
	hashToken,
} from "@/utils/crypto/server";
import { offsetMilliSeconds } from "@/utils/date";
import { createHonoApp } from "@/utils/factory/hono";

const jsonValidator = sValidator(
	"json",
	z.object({
		email: z.email(),
		password: z.string().min(1),
		rememberMe: z.boolean().optional().default(true),
	}),
	(result, c) => {
		if (!result.success) {
			return c.text(BAD_REQUEST, 400);
		}
	},
);

export const route = createHonoApp().post(
	"/",
	jsonValidator,
	injectExternalErrors,
	async (c) => {
		const { email, password, rememberMe } = c.req.valid("json");

		const db = getDBClient(c.env.DB);

		const user = await db
			.select()
			.from(usersTable)
			.where(eq(usersTable.email, email))
			.get();

		if (!user) {
			// Return 401 instead of 404 to prevent account enumeration attacks
			return c.text(UNAUTHORIZED, 401);
		}

		const now = new Date();

		const rateLimit = await db
			.select()
			.from(loginRateLimitsTable)
			.where(eq(loginRateLimitsTable.email, email))
			.get();

		if (rateLimit) {
			if (rateLimit.expiresAt < now) {
				await db
					.delete(loginRateLimitsTable)
					.where(eq(loginRateLimitsTable.email, email));
			} else if (rateLimit.lockedUntil && rateLimit.lockedUntil > now) {
				return c.text(TOO_MANY_REQUESTS, 429);
			}
		}

		if (!user.salt || !user.passwordHash) {
			return c.text(UNAUTHORIZED, 401);
		}

		const inputPasswordHash = hashPassword(password, user.salt);

		if (inputPasswordHash !== user.passwordHash) {
			const currentAttempts = rateLimit?.failedAttempts ?? 0;
			const newAttempts = currentAttempts + 1;
			const expiresAt = offsetMilliSeconds(now, LOGIN_RATE_LIMIT_EXPIRATION_MS);

			if (newAttempts >= LOGIN_MAX_ATTEMPTS) {
				const lockedUntil = offsetMilliSeconds(now, LOGIN_LOCK_DURATION_MS);
				await db
					.insert(loginRateLimitsTable)
					.values({
						email,
						failedAttempts: newAttempts,
						lockedUntil,
						expiresAt,
					})
					.onConflictDoUpdate({
						target: loginRateLimitsTable.email,
						set: {
							failedAttempts: newAttempts,
							lockedUntil,
							expiresAt,
						},
					});
			} else {
				await db
					.insert(loginRateLimitsTable)
					.values({
						email,
						failedAttempts: newAttempts,
						expiresAt,
					})
					.onConflictDoUpdate({
						target: loginRateLimitsTable.email,
						set: {
							failedAttempts: newAttempts,
							expiresAt,
						},
					});
			}

			return c.text(UNAUTHORIZED, 401);
		}

		await db
			.delete(loginRateLimitsTable)
			.where(eq(loginRateLimitsTable.email, email));

		const sessionId = generateUuidv7();
		const userAgent = c.req.header("User-Agent") ?? null;

		if (rememberMe) {
			// Issue access token + refresh token for persistent sessions
			const accessToken = await generateAccessToken(
				user.id,
				user.email,
				c.env.JWT_SECRET,
			);
			setAccessTokenCookie(c, accessToken);

			const refreshToken = generateSecureToken();
			const refreshTokenHash = hashToken(refreshToken);
			const expiresAt = offsetMilliSeconds(now, REFRESH_TOKEN_EXPIRATION_MS);

			await db.insert(loginSessionsTable).values({
				id: sessionId,
				userId: user.id,
				refreshTokenHash,
				userAgent,
				expiresAt,
			});

			setRefreshTokenCookie(c, refreshToken, true);
		} else {
			// Issue temporary session token only (session cookie)
			const tempSessionToken = generateSecureToken();
			const sessionTokenHash = hashToken(tempSessionToken);

			await db.insert(temporarySessionsTable).values({
				id: sessionId,
				userId: user.id,
				sessionTokenHash,
				userAgent,
			});

			setTempSessionCookie(c, tempSessionToken);
		}

		return c.text(OK, 200);
	},
);

export default route;
