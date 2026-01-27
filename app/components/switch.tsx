import type { JSX } from "hono/jsx/jsx-runtime";

type SwitchProps = {
	id: string;
	checked?: boolean;
	onChange?: (checked: boolean) => void;
	label?: string;
	disabled?: boolean;
	color?: "default" | "primary" | "secondary" | "danger";
};

export function Switch({
	id,
	checked = false,
	onChange,
	label,
	disabled = false,
	color = "default",
}: SwitchProps): JSX.Element {
	const baseTrackClasses =
		"relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ease-in-out";
	const disabledTrackClasses = "opacity-50 cursor-not-allowed";
	const enabledTrackClasses = "cursor-pointer";

	const colorClasses = {
		default: {
			checked: "bg-neutral-500 dark:bg-neutral-400",
			unchecked: "bg-neutral-300 dark:bg-neutral-600",
		},
		primary: {
			checked: "bg-emerald-500 dark:bg-emerald-400",
			unchecked: "bg-neutral-300 dark:bg-neutral-600",
		},
		secondary: {
			checked: "bg-fuchsia-500 dark:bg-fuchsia-400",
			unchecked: "bg-neutral-300 dark:bg-neutral-600",
		},
		danger: {
			checked: "bg-red-500 dark:bg-red-400",
			unchecked: "bg-neutral-300 dark:bg-neutral-600",
		},
	};

	const trackColorClass = checked
		? colorClasses[color].checked
		: colorClasses[color].unchecked;

	const trackClassName = `${baseTrackClasses} ${trackColorClass} ${
		disabled ? disabledTrackClasses : enabledTrackClasses
	}`;

	const thumbClassName = `inline-block h-5 w-5 transform rounded-full bg-white transition-transform duration-200 ease-in-out ${
		checked ? "translate-x-5" : "translate-x-0.5"
	}`;

	const handleClick = () => {
		if (disabled) return;
		if (onChange) {
			onChange(!checked);
		}
	};

	const switchElement = (
		<button
			type="button"
			role="switch"
			aria-checked={checked}
			aria-disabled={disabled}
			id={id}
			onClick={handleClick}
			disabled={disabled}
			class={trackClassName}
		>
			<span class={thumbClassName} />
		</button>
	);

	if (label) {
		return (
			<div class="flex items-center gap-3">
				{switchElement}
				<label
					for={id}
					class={`text-sm font-medium text-neutral-700 dark:text-neutral-300 ${
						disabled
							? "opacity-50 cursor-not-allowed"
							: "cursor-pointer select-none"
					}`}
				>
					{label}
				</label>
			</div>
		);
	}

	return switchElement;
}
