import { useEffect, useState } from "hono/jsx";
import type { JSX } from "hono/jsx/jsx-runtime";
import Switch from "@/islands/ui/switch";

const STORAGE_KEY = "theme";

export default function DarkModeSwitch(): JSX.Element {
	const [initialized, setInitialized] = useState(false);
	const [isDark, setIsDark] = useState(false);

	useEffect(() => {
		const stored = localStorage.getItem(STORAGE_KEY);
		const prefersDark = window.matchMedia(
			"(prefers-color-scheme: dark)",
		).matches;
		const initialDark = stored ? stored === "dark" : prefersDark;

		setIsDark(initialDark);
		applyTheme(initialDark);
		setInitialized(true);
	}, []);

	const applyTheme = (dark: boolean) => {
		if (dark) {
			document.documentElement.classList.add("dark");
		} else {
			document.documentElement.classList.remove("dark");
		}
	};

	const handleChange = (checked: boolean) => {
		setIsDark(checked);
		applyTheme(checked);
		localStorage.setItem(STORAGE_KEY, checked ? "dark" : "light");
	};

	if (!initialized) {
		return (
			<div class="flex items-center justify-between">
				<span class="text-sm font-medium text-neutral-700 dark:text-neutral-300">
					ダークモード
				</span>
				<div class="h-6 w-11" />
			</div>
		);
	}

	return (
		<div class="flex items-center justify-between">
			<Switch
				id="dark-mode-switch"
				label="dark"
				color="primary"
				defaultChecked={isDark}
				onChange={handleChange}
			/>
		</div>
	);
}
