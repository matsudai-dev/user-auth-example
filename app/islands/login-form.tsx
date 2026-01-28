import { useState } from "hono/jsx";
import type { JSX } from "hono/jsx/jsx-runtime";
import { TextInput } from "@/components/text-input";
import { apiClient } from "@/utils/api-client";
import Button from "./button";

export default function LoginForm(): JSX.Element {
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
		<form id="login-form" onSubmit={handleSubmit} class="space-y-4">
			<TextInput
				id="login-email"
				label="メールアドレス"
				type="email"
				value={email}
				onInput={(e) => setEmail((e.target as HTMLInputElement).value)}
				placeholder="example@example.com"
				required
				disabled={status === "loading"}
				color="primary"
			/>
			<TextInput
				id="login-password"
				label="パスワード"
				type="password"
				value={password}
				onInput={(e) => setPassword((e.target as HTMLInputElement).value)}
				required
				disabled={status === "loading"}
				color="secondary"
			/>
			<div class="flex items-center">
				<input
					type="checkbox"
					id="login-remember-me"
					checked={rememberMe}
					onChange={(e) =>
						setRememberMe((e.target as HTMLInputElement).checked)
					}
					class="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300 rounded"
					disabled={status === "loading"}
				/>
				<label for="login-remember-me" class="ml-2 block text-sm text-gray-700">
					ログイン状態を保持する
				</label>
			</div>
			{!rememberMe && (
				<p class="text-xs text-gray-500">
					ブラウザの設定によっては、ブラウザを閉じてもログイン状態が維持される場合があります。共有のパソコンをお使いの場合など、確実にログアウトしたい場合は設定画面から手動でログアウトすることをおすすめします。
				</p>
			)}
			{status === "error" && <p class="text-red-600 text-sm">{errorMessage}</p>}
			<Button
				id="login-submit"
				type="submit"
				color="primary"
				fullWidth
				disabled={status === "loading"}
			>
				{status === "loading" ? "ログイン中..." : "ログイン"}
			</Button>
		</form>
	);
}
