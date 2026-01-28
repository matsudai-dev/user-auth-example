import { useEffect, useState } from "hono/jsx";
import type { JSX } from "hono/jsx/jsx-runtime";
import Switch from "./switch";

const STORAGE_KEY = "theme";

export default function FloatingThemeToggle(): JSX.Element {
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

	return (
		<div class="fixed top-4 right-4 z-50 p-3 rounded-lg shadow-lg bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700">
			<div class="flex items-center gap-2">
				{initialized ? (
					<Switch
						id="floating-dark-mode-switch"
						label="dark"
						color="primary"
						defaultChecked={isDark}
						onChange={handleChange}
					/>
				) : (
					<div class="h-6 w-11" />
				)}
			</div>
		</div>
	);
}
