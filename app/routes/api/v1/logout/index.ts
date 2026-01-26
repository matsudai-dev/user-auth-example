import { eq } from "drizzle-orm";
import { OK } from "@/consts";
import { getDBClient } from "@/db/client";
import { loginSessionsTable } from "@/db/schemas";
import { loginRequired } from "@/middlewares/auth";
import { clearAuthCookies, getRefreshTokenFromCookie } from "@/utils/cookie";
import { hashToken } from "@/utils/crypto/server";
import { createHonoApp } from "@/utils/factory/hono";

export const route = createHonoApp().post("/", loginRequired, async (c) => {
	const refreshToken = await getRefreshTokenFromCookie(c);

	if (refreshToken) {
		const refreshTokenHash = hashToken(refreshToken);
		const db = getDBClient(c.env.DB);

		await db
			.delete(loginSessionsTable)
			.where(eq(loginSessionsTable.refreshTokenHash, refreshTokenHash));
	}

	clearAuthCookies(c);

	return c.text(OK, 200);
});

export default route;
