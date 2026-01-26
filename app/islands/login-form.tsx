import { useState } from "hono/jsx";
import { apiClient } from "@/utils/api-client";

export default function LoginForm() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [rememberMe, setRememberMe] = useState(true);
	const [status, setStatus] = useState<
		"idle" | "loading" | "success" | "error"
	>("idle");
	const [errorMessage, setErrorMessage] = useState("");

	const handleSubmit = async (e: Event) => {
		e.preventDefault();
		setStatus("loading");
		setErrorMessage("");

		const response = await apiClient.v1.login.$post({
			json: { email, password, rememberMe },
		});

		if (response.ok) {
			setStatus("success");
			const params = new URLSearchParams(window.location.search);
			const redirect = params.get("redirect");
			// Validate redirect to prevent open redirect (must be relative path)
			const redirectTo =
				redirect?.startsWith("/") && !redirect.startsWith("//")
					? redirect
					: "/";
			window.location.href = redirectTo;
			return;
		}

		setStatus("error");
		if (response.status === 400) {
			setErrorMessage("入力内容を確認してください");
		} else if (response.status === 401) {
			setErrorMessage("メールアドレスまたはパスワードが正しくありません");
		} else if (response.status === 429) {
			setErrorMessage(
				"ログイン試行回数が上限に達しました。しばらくしてから再度お試しください",
			);
		} else {
			setErrorMessage(
				"エラーが発生しました。しばらくしてから再度お試しください",
			);
		}
	};

	return (
		<form onSubmit={handleSubmit} class="space-y-4">
			<div>
				<label for="email" class="block text-sm font-medium text-gray-700">
					メールアドレス
				</label>
				<input
					type="email"
					id="email"
					value={email}
					onInput={(e) => setEmail((e.target as HTMLInputElement).value)}
					class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
					placeholder="example@example.com"
					required
					disabled={status === "loading"}
				/>
			</div>
			<div>
				<label for="password" class="block text-sm font-medium text-gray-700">
					パスワード
				</label>
				<input
					type="password"
					id="password"
					value={password}
					onInput={(e) => setPassword((e.target as HTMLInputElement).value)}
					class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
					required
					disabled={status === "loading"}
				/>
			</div>
			<div class="flex items-center">
				<input
					type="checkbox"
					id="rememberMe"
					checked={rememberMe}
					onChange={(e) =>
						setRememberMe((e.target as HTMLInputElement).checked)
					}
					class="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300 rounded"
					disabled={status === "loading"}
				/>
				<label for="rememberMe" class="ml-2 block text-sm text-gray-700">
					ログイン状態を保持する
				</label>
			</div>
			{status === "error" && <p class="text-red-600 text-sm">{errorMessage}</p>}
			<button
				type="submit"
				disabled={status === "loading"}
				class="w-full px-4 py-2 bg-orange-400 text-white rounded cursor-pointer hover:bg-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
			>
				{status === "loading" ? "ログイン中..." : "ログイン"}
			</button>
		</form>
	);
}
