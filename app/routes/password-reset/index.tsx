import { createRoute } from "honox/factory";
import PasswordResetForm from "@/islands/password-reset-form";

export default createRoute((c) => {
	return c.render(
		<>
			<title>パスワードリセット | User Auth Example</title>
			<div class="min-h-screen flex items-center justify-center">
				<div class="max-w-md w-full p-6 rounded-lg shadow-md">
					<h1 class="text-2xl font-bold text-center mb-6">
						パスワードリセット
					</h1>
					<PasswordResetForm />
					<p class="mt-4 text-center text-sm">
						<a
							href="/login"
							class="text-blue-600 dark:text-blue-400 hover:underline"
						>
							ログインに戻る
						</a>
					</p>
				</div>
			</div>
		</>,
	);
});
