import { createRoute } from "honox/factory";
import LoginForm from "@/islands/login-form";

export default createRoute((c) => {
	return c.render(
		<>
			<title>ログイン | User Auth Example</title>
			<div class="min-h-screen flex items-center justify-center">
				<div class="max-w-md w-full p-6 rounded-lg shadow-md">
					<h1 class="text-2xl font-bold text-center mb-6">ログイン</h1>
					<LoginForm />
					<p class="mt-4 text-center text-sm">
						アカウントをお持ちでない方は
						<a
							href="/signup"
							class="text-blue-600 dark:text-blue-400 hover:underline"
						>
							新規登録
						</a>
					</p>
					<p class="mt-2 text-center text-sm">
						<a
							data-testid="password-reset-link"
							href="/password-reset"
							class="text-blue-600 dark:text-blue-400 hover:underline"
						>
							パスワードをお忘れの方
						</a>
					</p>
				</div>
			</div>
		</>,
	);
});
