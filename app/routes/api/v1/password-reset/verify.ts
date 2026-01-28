import { sValidator } from "@hono/standard-validator";
import { eq } from "drizzle-orm";
import { z } from "zod/v4";
import { BAD_REQUEST, OK } from "@/consts";
import { getDBClient } from "@/db/client";
import { passwordResetSessionsTable, usersTable } from "@/db/schemas";
import { injectExternalErrors } from "@/middlewares/external-errors";
import { generateSalt, hashPassword, hashToken } from "@/utils/crypto/server";
import { createHonoApp } from "@/utils/factory/hono";
import { validatePassword } from "@/utils/validation";

const jsonValidator = sValidator(
	"json",
	z.object({
		passwordResetSessionToken: z.string().min(1),
		password: z.string().min(1),
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
		const { passwordResetSessionToken, password } = c.req.valid("json");

		const db = getDBClient(c.env.DB);

		const tokenHash = hashToken(passwordResetSessionToken);
		const session = await db
			.select()
			.from(passwordResetSessionsTable)
			.where(eq(passwordResetSessionsTable.tokenHash, tokenHash))
			.get();

		if (!session) {
			return c.text(BAD_REQUEST, 400);
		}

		const now = new Date();
		if (session.expiresAt < now) {
			await db
				.delete(passwordResetSessionsTable)
				.where(eq(passwordResetSessionsTable.id, session.id));
			return c.text(BAD_REQUEST, 400);
		}

		if (!validatePassword(password, session.email).isValid) {
			return c.text(BAD_REQUEST, 400);
		}

		const salt = generateSalt();
		const passwordHash = hashPassword(password, salt);

		await db
			.update(usersTable)
			.set({ salt, passwordHash })
			.where(eq(usersTable.email, session.email));

		await db
			.delete(passwordResetSessionsTable)
			.where(eq(passwordResetSessionsTable.id, session.id));

		return c.text(OK, 200);
	},
);

export default route;
