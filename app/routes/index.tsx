import { createRoute } from "honox/factory";
import { loginRequired } from "@/middlewares/login_required";

export default createRoute(loginRequired, (c) => {
	const user = c.get("user");

	return c.render(
		<>
			<title>User Auth Example</title>
			<div class="min-h-screen flex items-center justify-center bg-gray-50">
				<div class="max-w-md w-full p-6 bg-white rounded-lg shadow-md">
					<h1 class="text-2xl font-bold text-center mb-6">ホーム</h1>
					<p class="text-center text-gray-700">ログイン中: {user.email}</p>
				</div>
			</div>
		</>,
	);
});
