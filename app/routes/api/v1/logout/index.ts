import { eq } from "drizzle-orm";
import { OK } from "@/consts";
import { getDBClient } from "@/db/client";
import { loginSessionsTable, temporarySessionsTable } from "@/db/schemas";
import { loginRequired } from "@/middlewares/auth";
import { injectExternalErrors } from "@/middlewares/external-errors";
import {
	clearAuthCookies,
	getRefreshTokenFromCookie,
	getTempSessionTokenFromCookie,
} from "@/utils/cookie";
import { hashToken } from "@/utils/crypto/server";
import { createHonoApp } from "@/utils/factory/hono";

export const route = createHonoApp().post(
	"/",
	loginRequired,
	injectExternalErrors,
	async (c) => {
		const db = getDBClient(c.env.DB);

		// Handle refresh token session (rememberMe=true)
		const refreshToken = await getRefreshTokenFromCookie(c);
		if (refreshToken) {
			const refreshTokenHash = hashToken(refreshToken);
			await db
				.delete(loginSessionsTable)
				.where(eq(loginSessionsTable.refreshTokenHash, refreshTokenHash));
		}

		// Handle temporary session (rememberMe=false)
		const tempSessionToken = getTempSessionTokenFromCookie(c);
		if (tempSessionToken) {
			const sessionTokenHash = hashToken(tempSessionToken);
			await db
				.delete(temporarySessionsTable)
				.where(eq(temporarySessionsTable.sessionTokenHash, sessionTokenHash));
		}

		clearAuthCookies(c);

		return c.text(OK, 200);
	},
);

export default route;
