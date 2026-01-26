import { createRoute } from "honox/factory";
import { optionalAuth } from "@/middlewares/auth";

export default createRoute(optionalAuth, (c) => {
	const user = c.get("user");

	return c.render(
		<>
			<title>User Auth Example</title>
			<div class="min-h-screen flex items-center justify-center bg-gray-50">
				<div class="max-w-md w-full p-6 bg-white rounded-lg shadow-md">
					<h1 class="text-2xl font-bold text-center mb-6">ホーム</h1>
					{user ? (
						<div class="text-center space-y-2">
							<p class="text-gray-700">ログイン中: {user.email}</p>
							<p>
								<a href="/settings" class="text-blue-600 hover:underline">
									設定
								</a>
							</p>
						</div>
					) : (
						<p class="text-center text-gray-600">
							<a href="/login" class="text-blue-600 hover:underline">
								ログイン
							</a>
							してください
						</p>
					)}
				</div>
			</div>
		</>,
	);
});
