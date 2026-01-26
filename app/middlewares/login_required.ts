import { eq } from "drizzle-orm";
import type { Context, Next } from "hono";
import { getCookie } from "hono/cookie";
import { verify } from "hono/jwt";
import {
	ACCESS_TOKEN_COOKIE_NAME,
	REFRESH_TOKEN_COOKIE_NAME,
	REFRESH_TOKEN_EXPIRATION_MS,
} from "@/consts";
import { getDBClient } from "@/db/client";
import { loginSessionsTable, usersTable } from "@/db/schemas";
import {
	type AccessTokenPayload,
	clearAuthCookies,
	generateAccessToken,
	setAccessTokenCookie,
	setRefreshTokenCookie,
} from "@/utils/cookie";
import { generateSecureToken, hashToken } from "@/utils/crypto/server";
import { offsetMilliSeconds } from "@/utils/date";

export type AuthUser = {
	id: string;
	email: string;
};

declare module "hono" {
	interface ContextVariableMap {
		user: AuthUser;
	}
}

export async function loginRequired(
	c: Context,
	next: Next,
): Promise<Response | undefined> {
	const accessToken = getCookie(c, ACCESS_TOKEN_COOKIE_NAME);
	const refreshToken = getCookie(c, REFRESH_TOKEN_COOKIE_NAME);

	if (accessToken) {
		try {
			const payload = (await verify(
				accessToken,
				c.env.JWT_SECRET,
				"HS256",
			)) as AccessTokenPayload;
			c.set("user", { id: payload.sub, email: payload.email });
			await next();
			return;
		} catch {
			// Access token is invalid or expired, try refresh token
		}
	}

	if (!refreshToken) {
		clearAuthCookies(c);
		return c.redirect("/login");
	}

	const db = getDBClient(c.env.DB);
	const refreshTokenHash = hashToken(refreshToken);

	const session = await db
		.select()
		.from(loginSessionsTable)
		.where(eq(loginSessionsTable.refreshTokenHash, refreshTokenHash))
		.get();

	if (!session) {
		clearAuthCookies(c);
		return c.redirect("/login");
	}

	const now = new Date();

	if (session.expiresAt < now) {
		await db
			.delete(loginSessionsTable)
			.where(eq(loginSessionsTable.id, session.id));
		clearAuthCookies(c);
		return c.redirect("/login");
	}

	const user = await db
		.select()
		.from(usersTable)
		.where(eq(usersTable.id, session.userId))
		.get();

	if (!user) {
		await db
			.delete(loginSessionsTable)
			.where(eq(loginSessionsTable.id, session.id));
		clearAuthCookies(c);
		return c.redirect("/login");
	}

	const newAccessToken = await generateAccessToken(
		user.id,
		user.email,
		c.env.JWT_SECRET,
	);
	setAccessTokenCookie(c, newAccessToken);

	const newRefreshToken = generateSecureToken();
	const newRefreshTokenHash = hashToken(newRefreshToken);
	const newExpiresAt = offsetMilliSeconds(now, REFRESH_TOKEN_EXPIRATION_MS);

	await db
		.update(loginSessionsTable)
		.set({
			refreshTokenHash: newRefreshTokenHash,
			lastAccessedAt: now,
			expiresAt: newExpiresAt,
		})
		.where(eq(loginSessionsTable.id, session.id));

	setRefreshTokenCookie(c, newRefreshToken);

	c.set("user", { id: user.id, email: user.email });
	await next();
}
