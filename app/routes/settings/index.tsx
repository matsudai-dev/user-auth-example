import LogoutButton from "@/islands/logout-button";
import { createAuthenticatedRoute } from "@/utils/factory/hono";

export default createAuthenticatedRoute((c) => {
	const user = c.get("user");

	return c.render(
		<>
			<title>設定 | User Auth Example</title>
			<div class="min-h-screen flex items-center justify-center bg-gray-50">
				<div class="max-w-md w-full p-6 bg-white rounded-lg shadow-md">
					<h1 class="text-2xl font-bold text-center mb-6">設定</h1>
					<div class="space-y-4">
						<div>
							<span class="block text-sm font-medium text-gray-700">
								メールアドレス
							</span>
							<p class="mt-1 text-gray-900">{user.email}</p>
						</div>
						<div class="pt-4 border-t border-gray-200">
							<LogoutButton />
						</div>
					</div>
					<p class="mt-6 text-center text-sm text-gray-600">
						<a href="/" class="text-blue-600 hover:underline">
							ホームに戻る
						</a>
					</p>
				</div>
			</div>
		</>,
	);
});
