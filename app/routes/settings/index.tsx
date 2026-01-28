import DarkModeSwitch from "@/islands/dark-mode-switch";
import LogoutButton from "@/islands/logout-button";
import PasswordChangeForm from "@/islands/password-change-form";
import { createAuthenticatedRoute } from "@/utils/factory/hono";

export default createAuthenticatedRoute((c) => {
	const user = c.get("user");

	return c.render(
		<>
			<title>設定 | User Auth Example</title>
			<div class="min-h-screen flex items-center justify-center">
				<div class="max-w-md w-full p-6 rounded-lg shadow-md">
					<h1 class="text-2xl font-bold text-center mb-6">設定</h1>
					<div class="space-y-4">
						<div>
							<span class="block text-sm font-medium">メールアドレス</span>
							<p id="settings-email" class="mt-1">
								{user.email}
							</p>
						</div>
						<div class="pt-4 border-t">
							<span class="block text-sm font-medium mb-2">パスワード変更</span>
							<PasswordChangeForm email={user.email} />
						</div>
						<div class="pt-4 border-t">
							<DarkModeSwitch />
						</div>
						<div class="pt-4 border-t">
							<LogoutButton />
						</div>
					</div>
					<p class="mt-6 text-center text-sm">
						<a
							href="/"
							data-testid="home-link"
							class="text-blue-600 dark:text-blue-400 hover:underline"
						>
							ホームに戻る
						</a>
					</p>
				</div>
			</div>
		</>,
	);
});
