import { useState } from "hono/jsx";
import type { JSX } from "hono/jsx/jsx-runtime";
import { PASSWORD_MIN_LENGTH } from "@/consts";
import Button from "@/islands/ui/button";
import { TextInput } from "@/islands/ui/text-input";
import { apiClient } from "@/utils/api-client";
import { validatePassword } from "@/utils/validation";

type Props = {
	email: string;
};

function ValidationIcon({ isValid }: { isValid: boolean }): JSX.Element {
	if (isValid) {
		return <span class="text-green-600">&#10003;</span>;
	}
	return <span class="text-gray-400">&#10007;</span>;
}

export default function PasswordChangeForm({ email }: Props) {
	const [currentPassword, setCurrentPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [newPasswordConfirm, setNewPasswordConfirm] = useState("");
	const [status, setStatus] = useState<
		"idle" | "loading" | "success" | "error"
	>("idle");
	const [errorMessage, setErrorMessage] = useState("");

	const validation = validatePassword(newPassword, email);
	const passwordsMatch =
		newPassword === newPasswordConfirm && newPassword.length > 0;

	const handleSubmit = async (e: Event) => {
		e.preventDefault();
		if (status === "loading") return;

		// Validate before submission
		if (currentPassword.length === 0) {
			setStatus("error");
			setErrorMessage("現在のパスワードを入力してください");
			return;
		}
		if (!validation.isValid) {
			setStatus("error");
			setErrorMessage("新しいパスワードが要件を満たしていません");
			return;
		}
		if (!passwordsMatch) {
			setStatus("error");
			setErrorMessage("新しいパスワードが一致しません");
			return;
		}

		setStatus("loading");
		setErrorMessage("");

		const response = await apiClient.v1["password-change"].$post({
			json: { currentPassword, newPassword },
		});

		if (response.ok) {
			setStatus("success");
			setCurrentPassword("");
			setNewPassword("");
			setNewPasswordConfirm("");
			return;
		}

		setStatus("error");
		if (response.status === 401) {
			setErrorMessage("現在のパスワードが正しくありません");
		} else if (response.status === 400) {
			setErrorMessage("新しいパスワードが要件を満たしていません");
		} else {
			setErrorMessage(
				"エラーが発生しました。しばらくしてから再度お試しください",
			);
		}
	};

	return (
		<form id="password-change-form" onSubmit={handleSubmit} class="space-y-4">
			<TextInput
				id="password-change-current"
				label="現在のパスワード"
				type="password"
				value={currentPassword}
				onInput={(e) =>
					setCurrentPassword((e.target as HTMLInputElement).value)
				}
				disabled={status === "loading"}
			/>

			<div>
				<TextInput
					id="password-change-new"
					label="新しいパスワード"
					type="password"
					value={newPassword}
					onInput={(e) => setNewPassword((e.target as HTMLInputElement).value)}
					disabled={status === "loading"}
				/>
				<ul class="mt-2 text-sm space-y-1">
					<li>
						<ValidationIcon isValid={validation.isMinLength} />
						<span class="ml-2">{PASSWORD_MIN_LENGTH}文字以上</span>
					</li>
					<li>
						<ValidationIcon isValid={validation.hasThreeTypes} />
						<span class="ml-2">
							小文字・大文字・数字・記号から3種類以上
							<span class="text-gray-500 ml-1">
								(
								{[
									validation.hasLowercase && "小文字",
									validation.hasUppercase && "大文字",
									validation.hasNumber && "数字",
									validation.hasSymbol && "記号",
								]
									.filter(Boolean)
									.join(", ") || "なし"}
								)
							</span>
						</span>
					</li>
					<li>
						<ValidationIcon isValid={validation.isNotSimilarToEmail} />
						<span class="ml-2">メールアドレスと似ていない</span>
					</li>
				</ul>
			</div>

			<div>
				<TextInput
					id="password-change-new-confirm"
					label="新しいパスワード（確認用）"
					type="password"
					value={newPasswordConfirm}
					onInput={(e) =>
						setNewPasswordConfirm((e.target as HTMLInputElement).value)
					}
					disabled={status === "loading"}
				/>
				{newPasswordConfirm.length > 0 && (
					<p
						class={`mt-1 text-sm ${passwordsMatch ? "text-green-600" : "text-red-600"}`}
					>
						{passwordsMatch
							? "パスワードが一致しています"
							: "パスワードが一致しません"}
					</p>
				)}
			</div>

			{status === "error" && <p class="text-red-600 text-sm">{errorMessage}</p>}
			{status === "success" && (
				<p
					data-testid="password-change-success-message"
					class="text-green-600 text-sm"
				>
					パスワードを変更しました
				</p>
			)}

			<Button
				id="password-change-submit"
				type="submit"
				color="primary"
				fullWidth
				disabled={status === "loading"}
			>
				{status === "loading" ? "変更中..." : "変更する"}
			</Button>
		</form>
	);
}
