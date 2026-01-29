import { useState } from "hono/jsx";
import type { JSX } from "hono/jsx/jsx-runtime";
import Button from "@/islands/ui/button";
import { TextInput } from "@/islands/ui/text-input";
import { apiClient } from "@/utils/api-client";

export default function SignupForm(): JSX.Element {
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
				<p data-testid="signup-success-message" class="text-green-600 text-lg">
					確認メールを送信しました。メールをご確認ください。
				</p>
			</div>
		);
	}

	return (
		<form id="signup-form" onSubmit={handleSubmit} class="space-y-4">
			<TextInput
				id="signup-email"
				label="メールアドレス"
				type="email"
				value={email}
				onInput={(e) => setEmail((e.target as HTMLInputElement).value)}
				placeholder="example@example.com"
				required
				disabled={status === "loading"}
			/>
			{status === "error" && <p class="text-red-600 text-sm">{errorMessage}</p>}
			<Button
				id="signup-submit"
				type="submit"
				color="primary"
				fullWidth
				disabled={status === "loading"}
			>
				{status === "loading" ? "送信中..." : "招待メールを送信"}
			</Button>
		</form>
	);
}
