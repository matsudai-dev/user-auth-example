import { sValidator } from "@hono/standard-validator";
import { eq } from "drizzle-orm";
import { z } from "zod/v4";
import { BAD_REQUEST, OK, UNAUTHORIZED } from "@/consts";
import { getDBClient } from "@/db/client";
import {
	deletedUsersTable,
	loginSessionsTable,
	temporarySessionsTable,
	usersTable,
} from "@/db/schemas";
import { loginRequired } from "@/middlewares/auth";
import { injectExternalErrors } from "@/middlewares/external-errors";
import { clearAuthCookies } from "@/utils/cookie";
import { hashPassword } from "@/utils/crypto/server";
import { createHonoApp } from "@/utils/factory/hono";

const jsonValidator = sValidator(
	"json",
	z.object({
		password: z.string().min(1),
	}),
	(result, c) => {
		if (!result.success) {
			return c.text(BAD_REQUEST, 400);
		}
	},
);

export const route = createHonoApp().delete(
	"/",
	loginRequired,
	jsonValidator,
	injectExternalErrors,
	async (c) => {
		const { password } = c.req.valid("json");
		const user = c.get("user");

		const db = getDBClient(c.env.DB);

		const dbUser = await db
			.select()
			.from(usersTable)
			.where(eq(usersTable.id, user.id))
			.get();

		if (!dbUser || !dbUser.salt || !dbUser.passwordHash) {
			return c.text(UNAUTHORIZED, 401);
		}

		const passwordHash = hashPassword(password, dbUser.salt);

		if (passwordHash !== dbUser.passwordHash) {
			return c.text(UNAUTHORIZED, 401);
		}

		// Copy user info to deleted_users table
		await db.insert(deletedUsersTable).values({
			id: dbUser.id,
			email: dbUser.email,
		});

		// Delete all login sessions for this user
		await db
			.delete(loginSessionsTable)
			.where(eq(loginSessionsTable.userId, user.id));

		// Delete all temporary sessions for this user
		await db
			.delete(temporarySessionsTable)
			.where(eq(temporarySessionsTable.userId, user.id));

		// Delete user from users table
		await db.delete(usersTable).where(eq(usersTable.id, user.id));

		// Clear auth cookies
		clearAuthCookies(c);

		return c.text(OK, 200);
	},
);

export default route;
