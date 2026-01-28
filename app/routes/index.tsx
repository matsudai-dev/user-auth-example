import { createRoute } from "honox/factory";
import { optionalAuth } from "@/middlewares/auth";

export default createRoute(optionalAuth, (c) => {
	const user = c.get("user");

	return c.render(
		<>
			<title>User Auth Example</title>
			<div class="min-h-screen flex items-center justify-center">
				<div class="max-w-md w-full p-6 rounded-lg shadow-md">
					<h1 class="text-2xl font-bold text-center mb-6">ホーム</h1>
					{user ? (
						<div class="text-center space-y-2">
							<p id="logged-in-email">ログイン中: {user.email}</p>
							<p>
								<a
									href="/settings"
									data-testid="settings-link"
									class="text-blue-600 dark:text-blue-400 hover:underline"
								>
									設定
								</a>
							</p>
						</div>
					) : (
						<div class="text-center space-y-2">
							<p>
								<a
									href="/login"
									data-testid="login-link"
									class="text-blue-600 dark:text-blue-400 hover:underline"
								>
									ログイン
								</a>
								してください
							</p>
							<p>
								アカウントをお持ちでない方は
								<a
									href="/signup"
									data-testid="signup-link"
									class="text-blue-600 dark:text-blue-400 hover:underline"
								>
									新規登録
								</a>
							</p>
						</div>
					)}
				</div>
			</div>
		</>,
	);
});
