import { eq } from "drizzle-orm";
import { createRoute } from "honox/factory";
import { getDBClient } from "@/db/client";
import { signupSessionsTable } from "@/db/schemas";
import SignupVerifyForm from "@/islands/signup-verify-form";
import { hashToken } from "@/utils/crypto/server";

export default createRoute(async (c) => {
	const token = c.req.query("token");

	if (!token) {
		return c.render(
			<>
				<title>エラー | User Auth Example</title>
				<div class="min-h-screen flex items-center justify-center">
					<div class="max-w-md w-full p-6 rounded-lg shadow-md">
						<h1 class="text-2xl font-bold text-center mb-6 text-red-600 dark:text-red-400">
							エラー
						</h1>
						<p class="text-center">
							無効なリンクです。メールに記載されたリンクを再度クリックしてください。
						</p>
					</div>
				</div>
			</>,
		);
	}

	const db = getDBClient(c.env.DB);
	const tokenHash = hashToken(token);

	const session = await db
		.select()
		.from(signupSessionsTable)
		.where(eq(signupSessionsTable.tokenHash, tokenHash))
		.get();

	if (!session) {
		return c.render(
			<>
				<title>エラー | User Auth Example</title>
				<div class="min-h-screen flex items-center justify-center">
					<div class="max-w-md w-full p-6 rounded-lg shadow-md">
						<h1 class="text-2xl font-bold text-center mb-6 text-red-600 dark:text-red-400">
							エラー
						</h1>
						<p class="text-center">
							このリンクは無効または期限切れです。再度登録をお試しください。
						</p>
					</div>
				</div>
			</>,
		);
	}

	const now = new Date();
	if (session.expiresAt < now) {
		return c.render(
			<>
				<title>エラー | User Auth Example</title>
				<div class="min-h-screen flex items-center justify-center">
					<div class="max-w-md w-full p-6 rounded-lg shadow-md">
						<h1 class="text-2xl font-bold text-center mb-6 text-red-600 dark:text-red-400">
							エラー
						</h1>
						<p class="text-center">
							このリンクは期限切れです。再度登録をお試しください。
						</p>
					</div>
				</div>
			</>,
		);
	}

	return c.render(
		<>
			<title>パスワード設定 | User Auth Example</title>
			<div class="min-h-screen flex items-center justify-center">
				<div class="max-w-md w-full p-6 rounded-lg shadow-md">
					<h1 class="text-2xl font-bold text-center mb-6">パスワード設定</h1>
					<SignupVerifyForm email={session.email} token={token} />
				</div>
			</div>
		</>,
	);
});
