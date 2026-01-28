import { useState } from "hono/jsx";
import type { JSX } from "hono/jsx/jsx-runtime";
import { apiClient } from "@/utils/api-client";
import Button from "./button";

export default function LogoutButton(): JSX.Element {
	const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");

	const handleLogout = async () => {
		setStatus("loading");

		const response = await apiClient.v1.logout.$post();

		if (response.ok) {
			window.location.href = "/";
			return;
		}

		setStatus("error");
	};

	return (
		<div>
			<Button
				id="logout-button"
				onClick={handleLogout}
				disabled={status === "loading"}
			>
				{status === "loading" ? "ログアウト中..." : "ログアウト"}
			</Button>
			{status === "error" && (
				<p class="mt-2 text-red-600 text-sm">
					エラーが発生しました。再度お試しください
				</p>
			)}
		</div>
	);
}
