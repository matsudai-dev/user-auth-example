import { sValidator } from "@hono/standard-validator";
import { eq } from "drizzle-orm";
import { z } from "zod/v4";
import { BAD_REQUEST, OK, UNAUTHORIZED } from "@/consts";
import { getDBClient } from "@/db/client";
import { usersTable } from "@/db/schemas";
import { loginRequired } from "@/middlewares/auth";
import { injectExternalErrors } from "@/middlewares/external-errors";
import { generateSalt, hashPassword } from "@/utils/crypto/server";
import { createHonoApp } from "@/utils/factory/hono";
import { validatePassword } from "@/utils/validation";

const jsonValidator = sValidator(
	"json",
	z.object({
		currentPassword: z.string().min(1),
		newPassword: z.string().min(1),
	}),
	(result, c) => {
		if (!result.success) {
			return c.text(BAD_REQUEST, 400);
		}
	},
);

export const route = createHonoApp().post(
	"/",
	loginRequired,
	jsonValidator,
	injectExternalErrors,
	async (c) => {
		const { currentPassword, newPassword } = c.req.valid("json");
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

		const currentPasswordHash = hashPassword(currentPassword, dbUser.salt);

		if (currentPasswordHash !== dbUser.passwordHash) {
			return c.text(UNAUTHORIZED, 401);
		}

		if (!validatePassword(newPassword, user.email).isValid) {
			return c.text(BAD_REQUEST, 400);
		}

		const salt = generateSalt();
		const passwordHash = hashPassword(newPassword, salt);

		await db
			.update(usersTable)
			.set({ salt, passwordHash })
			.where(eq(usersTable.id, user.id));

		return c.text(OK, 200);
	},
);

export default route;
