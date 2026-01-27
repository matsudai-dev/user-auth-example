import type { Context } from "hono";
import { deleteCookie, getCookie, setCookie } from "hono/cookie";
import { sign, verify } from "hono/jwt";
import type { JWTPayload } from "hono/utils/jwt/types";
import {
	ACCESS_TOKEN_COOKIE_NAME,
	ACCESS_TOKEN_EXPIRATION_MS,
	REFRESH_TOKEN_COOKIE_NAME,
	REFRESH_TOKEN_EXPIRATION_MS,
	TEMP_SESSION_COOKIE_NAME,
} from "@/consts";
import { generateSecureToken, hashToken } from "@/utils/crypto/server";
import { offsetMilliSeconds } from "@/utils/date";

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
 * Generates a refresh token with its hash and expiration date.
 *
 * @returns Object containing the raw token, hashed token, and expiration date
 */
export function generateRefreshToken(): {
	refreshToken: string;
	refreshTokenHash: string;
	expiresAt: Date;
} {
	const refreshToken = generateSecureToken();
	const refreshTokenHash = hashToken(refreshToken);
	const expiresAt = offsetMilliSeconds(new Date(), REFRESH_TOKEN_EXPIRATION_MS);

	return { refreshToken, refreshTokenHash, expiresAt };
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
 * @param rememberMe - If true (default), sets maxAge for persistent cookie; if false, creates session cookie
 */
export function setRefreshTokenCookie(
	c: Context,
	token: string,
	rememberMe = true,
): void {
	const cookieOptions: Parameters<typeof setCookie>[3] = {
		httpOnly: true,
		secure: true,
		sameSite: "Strict",
		path: "/",
	};

	if (rememberMe) {
		cookieOptions.maxAge = Math.floor(REFRESH_TOKEN_EXPIRATION_MS / 1000);
	}

	setCookie(c, REFRESH_TOKEN_COOKIE_NAME, token, cookieOptions);
}

/**
 * Retrieves and verifies the access token payload from the cookie.
 *
 * @param c - The Hono context
 * @returns The decoded JWT payload if valid, null otherwise
 */
export async function getPayloadFromAccessToken(
	c: Context,
): Promise<AccessTokenPayload | null> {
	const accessToken = getCookie(c, ACCESS_TOKEN_COOKIE_NAME);

	if (!accessToken) {
		return null;
	}

	try {
		const payload = await verify(accessToken, c.env.JWT_SECRET, "HS256");

		return payload as AccessTokenPayload;
	} catch {
		return null;
	}
}

/**
 * Retrieves the refresh token from the cookie.
 *
 * @param c - The Hono context
 * @returns The refresh token if present, null otherwise
 */
export async function getRefreshTokenFromCookie(
	c: Context,
): Promise<string | null> {
	const refreshToken = getCookie(c, REFRESH_TOKEN_COOKIE_NAME);

	if (!refreshToken) {
		return null;
	}

	return refreshToken;
}

/**
 * Sets the temporary session cookie (session cookie - no maxAge).
 *
 * @param c - The Hono context
 * @param token - The temporary session token to set
 */
export function setTempSessionCookie(c: Context, token: string): void {
	setCookie(c, TEMP_SESSION_COOKIE_NAME, token, {
		httpOnly: true,
		secure: true,
		sameSite: "Strict",
		path: "/",
		// No maxAge = session cookie (deleted when browser closes)
	});
}

/**
 * Retrieves the temporary session token from the cookie.
 *
 * @param c - The Hono context
 * @returns The temporary session token if present, null otherwise
 */
export function getTempSessionTokenFromCookie(c: Context): string | null {
	const token = getCookie(c, TEMP_SESSION_COOKIE_NAME);
	return token ?? null;
}

/**
 * Clears authentication cookies.
 *
 * @param c - The Hono context
 */
export function clearAuthCookies(c: Context): void {
	deleteCookie(c, ACCESS_TOKEN_COOKIE_NAME, { path: "/" });
	deleteCookie(c, REFRESH_TOKEN_COOKIE_NAME, { path: "/" });
	deleteCookie(c, TEMP_SESSION_COOKIE_NAME, { path: "/" });
}
