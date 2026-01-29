import { sValidator } from "@hono/standard-validator";
import { eq } from "drizzle-orm";
import { renderToString } from "hono/jsx/dom/server";
import { z } from "zod/v4";
import {
	BAD_REQUEST,
	INTERNAL_SERVER_ERROR,
	OK,
	PASSWORD_RESET_SESSION_EXPIRATION_MS,
} from "@/consts";
import { getDBClient } from "@/db/client";
import { passwordResetSessionsTable, usersTable } from "@/db/schemas";
import { getEmailClient } from "@/email/client";
import { PasswordResetEmail } from "@/email/templates/password-reset";
import { injectExternalErrors } from "@/middlewares/external-errors";
import {
	generateSecureToken,
	generateUuidv7,
	hashToken,
} from "@/utils/crypto/server";
import { offsetMilliSeconds } from "@/utils/date";
import { createHonoApp } from "@/utils/factory/hono";

const jsonValidator = sValidator(
	"json",
	z.object({
		email: z.email(),
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
		const { email } = c.req.valid("json");

		const db = getDBClient(c.env.DB);

		const user = await db
			.select()
			.from(usersTable)
			.where(eq(usersTable.email, email))
			.get();

		// Always return 200 to prevent user enumeration
		if (!user) {
			return c.text(OK, 200);
		}

		const existingSession = await db
			.select()
			.from(passwordResetSessionsTable)
			.where(eq(passwordResetSessionsTable.email, email))
			.get();

		if (existingSession) {
			await db
				.delete(passwordResetSessionsTable)
				.where(eq(passwordResetSessionsTable.email, email));
		}

		const id = generateUuidv7();
		const token = generateSecureToken();
		const tokenHash = hashToken(token);

		const now = new Date();
		const expiresAt = offsetMilliSeconds(
			now,
			PASSWORD_RESET_SESSION_EXPIRATION_MS,
		);

		await db.insert(passwordResetSessionsTable).values({
			id,
			email,
			tokenHash,
			expiresAt,
		});

		const resend = getEmailClient(c.env.RESEND_API_KEY);

		const url = new URL(c.req.url);
		const resetUrl = `${url.origin}/password-reset/verify?token=${token}`;

		const html = renderToString(<PasswordResetEmail resetUrl={resetUrl} />);

		const { error } = await resend.emails.send({
			from: c.env.RESEND_EMAIL_FROM,
			to: email,
			subject: "パスワードリセット",
			html,
		});

		if (error) {
			return c.text(INTERNAL_SERVER_ERROR, 500);
		}

		return c.text(OK, 200);
	},
);

export default route;
