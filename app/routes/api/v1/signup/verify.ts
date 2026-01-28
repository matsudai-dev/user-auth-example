import { sValidator } from "@hono/standard-validator";
import { eq } from "drizzle-orm";
import { z } from "zod/v4";
import {
	BAD_REQUEST,
	CONFLICT,
	OK,
	REFRESH_TOKEN_EXPIRATION_MS,
} from "@/consts";
import { getDBClient } from "@/db/client";
import {
	loginSessionsTable,
	signupSessionsTable,
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
	generateSalt,
	generateSecureToken,
	generateUuidv7,
	hashPassword,
	hashToken,
} from "@/utils/crypto/server";
import { offsetMilliSeconds } from "@/utils/date";
import { createHonoApp } from "@/utils/factory/hono";
import { validatePassword } from "@/utils/validation";

const jsonValidator = sValidator(
	"json",
	z.object({
		signupSessionToken: z.string().min(1),
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
		const { signupSessionToken, password, rememberMe } = c.req.valid("json");

		const db = getDBClient(c.env.DB);

		const tokenHash = hashToken(signupSessionToken);
		const session = await db
			.select()
			.from(signupSessionsTable)
			.where(eq(signupSessionsTable.tokenHash, tokenHash))
			.get();

		if (!session) {
			return c.text(BAD_REQUEST, 400);
		}

		const now = new Date();
		if (session.expiresAt < now) {
			await db
				.delete(signupSessionsTable)
				.where(eq(signupSessionsTable.id, session.id));
			return c.text(BAD_REQUEST, 400);
		}

		if (!validatePassword(password, session.email).isValid) {
			return c.text(BAD_REQUEST, 400);
		}

		const existingUser = await db
			.select()
			.from(usersTable)
			.where(eq(usersTable.email, session.email))
			.get();

		if (existingUser) {
			return c.text(CONFLICT, 409);
		}

		const userId = generateUuidv7();
		const salt = generateSalt();
		const passwordHash = hashPassword(password, salt);

		await db.insert(usersTable).values({
			id: userId,
			email: session.email,
			salt,
			passwordHash,
		});

		await db
			.delete(signupSessionsTable)
			.where(eq(signupSessionsTable.id, session.id));

		const sessionId = generateUuidv7();
		const userAgent = c.req.header("User-Agent") ?? null;

		if (rememberMe) {
			// Issue access token + refresh token for persistent sessions
			const accessToken = await generateAccessToken(
				userId,
				session.email,
				c.env.JWT_SECRET,
			);
			setAccessTokenCookie(c, accessToken);

			const refreshToken = generateSecureToken();
			const refreshTokenHash = hashToken(refreshToken);
			const expiresAt = offsetMilliSeconds(now, REFRESH_TOKEN_EXPIRATION_MS);

			await db.insert(loginSessionsTable).values({
				id: sessionId,
				userId,
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
				userId,
				sessionTokenHash,
				userAgent,
			});

			setTempSessionCookie(c, tempSessionToken);
		}

		return c.text(OK, 200);
	},
);

export default route;
