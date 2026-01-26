import type { Context } from "hono";
import { deleteCookie, setCookie } from "hono/cookie";
import { sign } from "hono/jwt";
import type { JWTPayload } from "hono/utils/jwt/types";
import {
	ACCESS_TOKEN_COOKIE_NAME,
	ACCESS_TOKEN_EXPIRATION_MS,
	REFRESH_TOKEN_COOKIE_NAME,
	REFRESH_TOKEN_EXPIRATION_MS,
} from "@/consts";

export type AccessTokenPayload = JWTPayload & {
	sub: string;
	email: string;
};

/**
 * Generates a JWT access token for authentication.
 *
 * @param userId - The user's ID (UUIDv7)
 * @param email - The user's email address
 * @param secret - The JWT secret key
 * @returns Promise resolving to the signed JWT access token
 */
export async function generateAccessToken(
	userId: string,
	email: string,
	secret: string,
): Promise<string> {
	const now = Math.floor(Date.now() / 1000);
	const exp = now + Math.floor(ACCESS_TOKEN_EXPIRATION_MS / 1000);

	const payload: AccessTokenPayload = {
		sub: userId,
		email,
		exp,
		iat: now,
	};

	return await sign(payload, secret);
}

/**
 * Sets the access token cookie with the JWT.
 *
 * @param c - The Hono context
 * @param token - The JWT access token to set
 */
export function setAccessTokenCookie(c: Context, token: string): void {
	setCookie(c, ACCESS_TOKEN_COOKIE_NAME, token, {
		httpOnly: true,
		secure: true,
		sameSite: "Strict",
		path: "/",
		maxAge: Math.floor(ACCESS_TOKEN_EXPIRATION_MS / 1000),
	});
}

/**
 * Sets the refresh token cookie.
 *
 * @param c - The Hono context
 * @param token - The refresh token to set
 */
export function setRefreshTokenCookie(c: Context, token: string): void {
	setCookie(c, REFRESH_TOKEN_COOKIE_NAME, token, {
		httpOnly: true,
		secure: true,
		sameSite: "Strict",
		path: "/",
		maxAge: Math.floor(REFRESH_TOKEN_EXPIRATION_MS / 1000),
	});
}

/**
 * Clears authentication cookies.
 *
 * @param c - The Hono context
 */
export function clearAuthCookies(c: Context): void {
	deleteCookie(c, ACCESS_TOKEN_COOKIE_NAME, { path: "/" });
	deleteCookie(c, REFRESH_TOKEN_COOKIE_NAME, { path: "/" });
}
