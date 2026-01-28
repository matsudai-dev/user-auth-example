import type { JSX } from "hono/jsx/jsx-runtime";

type ButtonProps = {
	id: string;
	type?: "button" | "submit" | "reset";
	disabled?: boolean;
	color?: "default" | "primary" | "secondary" | "danger";
	fullWidth?: boolean;
	onClick?: (e: MouseEvent) => void;
	children: JSX.Element | string;
};

export default function Button({
	id,
	type = "button",
	disabled = false,
	color = "default",
	fullWidth = false,
	onClick,
	children,
}: ButtonProps): JSX.Element {
	const baseClasses =
		"px-4 py-2 rounded cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-colors";

	const colorClasses = {
		default:
			"bg-neutral-500 dark:bg-neutral-600 text-white hover:bg-neutral-600 dark:hover:bg-neutral-500",
		primary:
			"bg-emerald-500 dark:bg-emerald-600 text-white hover:bg-emerald-600 dark:hover:bg-emerald-500",
		secondary:
			"bg-fuchsia-500 dark:bg-fuchsia-600 text-white hover:bg-fuchsia-600 dark:hover:bg-fuchsia-500",
		danger:
			"bg-red-500 dark:bg-red-600 text-white hover:bg-red-600 dark:hover:bg-red-500",
	};

	const widthClass = fullWidth ? "w-full" : "";

	const className = `${baseClasses} ${colorClasses[color]} ${widthClass}`;

	return (
		<button
			type={type}
			id={id}
			disabled={disabled}
			onClick={onClick}
			class={className}
		>
			{children}
		</button>
	);
}
