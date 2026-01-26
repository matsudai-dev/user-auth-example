import { useState } from "hono/jsx";
import { apiClient } from "@/utils/api-client";

export default function LogoutButton() {
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
			<button
				type="button"
				onClick={handleLogout}
				disabled={status === "loading"}
				class="px-4 py-2 bg-gray-500 text-white rounded cursor-pointer hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
			>
				{status === "loading" ? "ログアウト中..." : "ログアウト"}
			</button>
			{status === "error" && (
				<p class="mt-2 text-red-600 text-sm">
					エラーが発生しました。再度お試しください
				</p>
			)}
		</div>
	);
}
