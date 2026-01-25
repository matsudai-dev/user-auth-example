import { createRoute } from "honox/factory";
import LoginForm from "@/islands/login-form";

export default createRoute((c) => {
	return c.render(
		<>
			<title>ログイン | User Auth Example</title>
			<div class="min-h-screen flex items-center justify-center bg-gray-50">
				<div class="max-w-md w-full p-6 bg-white rounded-lg shadow-md">
					<h1 class="text-2xl font-bold text-center mb-6">ログイン</h1>
					<LoginForm />
				</div>
			</div>
		</>,
	);
});
