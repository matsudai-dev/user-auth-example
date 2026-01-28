import { useState } from "hono/jsx";
import type { JSX } from "hono/jsx/jsx-runtime";
import { PASSWORD_MIN_LENGTH } from "@/consts";
import Button from "@/islands/ui/button";
import { TextInput } from "@/islands/ui/text-input";
import { apiClient } from "@/utils/api-client";
import { validatePassword } from "@/utils/validation";

type Props = {
	email: string;
	token: string;
};

function ValidationIcon({ isValid }: { isValid: boolean }): JSX.Element {
	if (isValid) {
		return <span class="text-green-600">&#10003;</span>;
	}
	return <span class="text-gray-400">&#10007;</span>;
}

export default function PasswordResetVerifyForm({ email, token }: Props) {
	const [password, setPassword] = useState("");
	const [passwordConfirm, setPasswordConfirm] = useState("");
	const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
	const [errorMessage, setErrorMessage] = useState("");

	const validation = validatePassword(password, email);
	const passwordsMatch = password === passwordConfirm && password.length > 0;
	const canSubmit =
		validation.isValid && passwordsMatch && status !== "loading";

	const handleSubmit = async (e: Event) => {
		e.preventDefault();
		if (!canSubmit) return;

		setStatus("loading");
		setErrorMessage("");

		const response = await apiClient.v1["password-reset"].verify.$post({
			json: { passwordResetSessionToken: token, password },
		});

		if (response.ok) {
			window.location.href = "/login";
			return;
		}

		setStatus("error");
		if (response.status === 400) {
			setErrorMessage("トークンが無効または期限切れです");
		} else {
			setErrorMessage(
				"エラーが発生しました。しばらくしてから再度お試しください",
			);
		}
	};

	return (
		<form
			id="password-reset-verify-form"
			onSubmit={handleSubmit}
			class="space-y-6"
		>
			<TextInput
				label="メールアドレス"
				type="email"
				id="password-reset-verify-email"
				value={email}
				disabled
			/>

			<div>
				<TextInput
					id="password-reset-verify-password"
					label="新しいパスワード"
					type="password"
					value={password}
					onInput={(e) => setPassword((e.target as HTMLInputElement).value)}
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
					id="password-reset-verify-password-confirm"
					label="新しいパスワード（確認用）"
					type="password"
					value={passwordConfirm}
					onInput={(e) =>
						setPasswordConfirm((e.target as HTMLInputElement).value)
					}
					disabled={status === "loading"}
				/>
				{passwordConfirm.length > 0 && (
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

			<Button
				id="password-reset-verify-submit"
				type="submit"
				color="primary"
				fullWidth
				disabled={!canSubmit}
			>
				{status === "loading" ? "変更中..." : "パスワードを変更"}
			</Button>
		</form>
	);
}
