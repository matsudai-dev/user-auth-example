import { useState } from "hono/jsx";
import type { JSX } from "hono/jsx/jsx-runtime";
import Button from "@/islands/ui/button";
import { TextInput } from "@/islands/ui/text-input";
import { apiClient } from "@/utils/api-client";

export default function AccountDeleteForm(): JSX.Element {
	const [password, setPassword] = useState("");
	const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
	const [errorMessage, setErrorMessage] = useState("");

	const handleSubmit = async (e: Event) => {
		e.preventDefault();
		if (status === "loading") return;

		// Validate before submission
		if (password.length === 0) {
			setStatus("error");
			setErrorMessage("パスワードを入力してください");
			return;
		}

		setStatus("loading");
		setErrorMessage("");

		const response = await apiClient.v1.account.$delete({
			json: { password },
		});

		if (response.ok) {
			window.location.href = "/";
			return;
		}

		setStatus("error");
		if (response.status === 401) {
			setErrorMessage("パスワードが正しくありません");
		} else {
			setErrorMessage(
				"エラーが発生しました。しばらくしてから再度お試しください",
			);
		}
	};

	return (
		<form id="account-delete-form" onSubmit={handleSubmit} class="space-y-4">
			<TextInput
				id="account-delete-password"
				label="パスワードを入力して確認"
				type="password"
				value={password}
				onInput={(e) => setPassword((e.target as HTMLInputElement).value)}
				disabled={status === "loading"}
			/>

			{status === "error" && <p class="text-red-600 text-sm">{errorMessage}</p>}

			<Button
				id="account-delete-submit"
				type="submit"
				color="danger"
				fullWidth
				disabled={status === "loading"}
			>
				{status === "loading" ? "削除中..." : "アカウントを削除"}
			</Button>
		</form>
	);
}
