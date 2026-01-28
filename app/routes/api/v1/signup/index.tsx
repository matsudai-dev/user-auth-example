import { sValidator } from "@hono/standard-validator";
import { eq } from "drizzle-orm";
import { renderToString } from "hono/jsx/dom/server";
import { z } from "zod/v4";
import {
	BAD_REQUEST,
	CONFLICT,
	INTERNAL_SERVER_ERROR,
	OK,
	SIGNUP_SESSION_EXPIRATION_MS,
} from "@/consts";
import { getDBClient } from "@/db/client";
import { signupSessionsTable, usersTable } from "@/db/schemas";
import { getEmailClient } from "@/email/client";
import { SignupVerificationEmail } from "@/email/templates/signup-verification";
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

		const existingUser = await db
			.select()
			.from(usersTable)
			.where(eq(usersTable.email, email))
			.get();

		if (existingUser) {
			return c.text(CONFLICT, 409);
		}

		const existingSession = await db
			.select()
			.from(signupSessionsTable)
			.where(eq(signupSessionsTable.email, email))
			.get();

		if (existingSession) {
			await db
				.delete(signupSessionsTable)
				.where(eq(signupSessionsTable.email, email));
		}

		const id = generateUuidv7();
		const token = generateSecureToken();
		const tokenHash = hashToken(token);

		const now = new Date();
		const expiresAt = offsetMilliSeconds(now, SIGNUP_SESSION_EXPIRATION_MS);

		await db.insert(signupSessionsTable).values({
			id,
			email,
			tokenHash,
			expiresAt,
		});

		const resend = getEmailClient(c.env.RESEND_API_KEY);

		const url = new URL(c.req.url);
		const verifyUrl = `${url.origin}/signup/verify?token=${token}`;

		const html = renderToString(
			<SignupVerificationEmail verifyUrl={verifyUrl} />,
		);

		const { error } = await resend.emails.send({
			from: c.env.RESEND_EMAIL_FROM,
			to: email,
			subject: "メールアドレスの確認",
			html,
		});

		if (error) {
			return c.text(INTERNAL_SERVER_ERROR, 500);
		}

		return c.text(OK, 200);
	},
);

export default route;
