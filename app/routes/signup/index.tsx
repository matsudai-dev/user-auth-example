import { createRoute } from "honox/factory";
import SignupForm from "@/islands/signup-form";

export default createRoute((c) => {
	return c.render(
		<>
			<title>新規登録 | User Auth Example</title>
			<div class="min-h-screen flex items-center justify-center">
				<div class="max-w-md w-full p-6 rounded-lg shadow-md">
					<h1 class="text-2xl font-bold text-center mb-6">新規登録</h1>
					<SignupForm />
				</div>
			</div>
		</>,
	);
});
