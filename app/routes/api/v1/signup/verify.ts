import { sValidator } from "@hono/standard-validator";
import { eq } from "drizzle-orm";
import { z } from "zod/v4";
import { BAD_REQUEST, CONFLICT, OK } from "@/consts";
import { getDBClient } from "@/db/client";
import { signupSessionsTable, usersTable } from "@/db/schemas";
import { generateAccessToken, setAccessTokenCookie } from "@/utils/cookie";
import {
	generateSalt,
	generateUuidv7,
	hashPassword,
	hashToken,
} from "@/utils/crypto/server";
import { createHonoApp } from "@/utils/factory/hono";
import { validatePassword } from "@/utils/validation";

const jsonValidator = sValidator(
	"json",
	z.object({
		signupSessionToken: z.string().min(1),
		password: z.string().min(1),
	}),
	(result, c) => {
		if (!result.success) {
			return c.text(BAD_REQUEST, 400);
		}
	},
);

export const route = createHonoApp().post("/", jsonValidator, async (c) => {
	const { signupSessionToken, password } = c.req.valid("json");

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

	const token = await generateAccessToken(
		userId,
		session.email,
		c.env.JWT_SECRET,
	);
	setAccessTokenCookie(c, token);

	return c.text(OK, 200);
});

export default route;
