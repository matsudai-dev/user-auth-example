import { useState } from "hono/jsx";
import { apiClient } from "@/utils/api-client";

export default function SignupForm() {
	const [email, setEmail] = useState("");
	const [status, setStatus] = useState<
		"idle" | "loading" | "success" | "error"
	>("idle");
	const [errorMessage, setErrorMessage] = useState("");

	const handleSubmit = async (e: Event) => {
		e.preventDefault();
		setStatus("loading");
		setErrorMessage("");

		const response = await apiClient.v1.signup.$post({
			json: { email },
		});

		if (response.ok) {
			setStatus("success");
			return;
		}

		setStatus("error");
		if (response.status === 400) {
			setErrorMessage("メールアドレスの形式が正しくありません");
		} else if (response.status === 409) {
			setErrorMessage("このメールアドレスは既に登録されています");
		} else {
			setErrorMessage(
				"エラーが発生しました。しばらくしてから再度お試しください",
			);
		}
	};

	if (status === "success") {
		return (
			<div class="text-center">
				<p class="text-green-600 text-lg">
					確認メールを送信しました。メールをご確認ください。
				</p>
			</div>
		);
	}

	return (
		<form id="signup-form" onSubmit={handleSubmit} class="space-y-4">
			<div>
				<label
					for="signup-email"
					class="block text-sm font-medium text-gray-700"
				>
					メールアドレス
				</label>
				<input
					type="email"
					id="signup-email"
					value={email}
					onInput={(e) => setEmail((e.target as HTMLInputElement).value)}
					class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
					placeholder="example@example.com"
					required
					disabled={status === "loading"}
				/>
			</div>
			{status === "error" && <p class="text-red-600 text-sm">{errorMessage}</p>}
			<button
				type="submit"
				id="signup-submit"
				disabled={status === "loading"}
				class="w-full px-4 py-2 bg-orange-400 text-white rounded cursor-pointer hover:bg-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
			>
				{status === "loading" ? "送信中..." : "招待メールを送信"}
			</button>
		</form>
	);
}
