import { useState } from "hono/jsx";
import type { JSX } from "hono/jsx/jsx-runtime";

type SwitchProps = {
	id: string;
	name?: string;
	defaultChecked?: boolean;
	onChange?: (checked: boolean) => void;
	label?: string;
	disabled?: boolean;
	color?: "default" | "primary" | "secondary" | "danger";
};

export default function Switch({
	id,
	name,
	defaultChecked = false,
	onChange,
	label,
	disabled = false,
	color = "default",
}: SwitchProps): JSX.Element {
	const [checked, setChecked] = useState(defaultChecked);

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

	const baseTrackClasses =
		"relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ease-in-out";
	const disabledClasses = disabled ? "opacity-50 cursor-not-allowed" : "";

	const trackClassName = `${baseTrackClasses} ${trackColorClass} ${disabledClasses}`;

	const thumbClassName = `inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform duration-200 ease-in-out ${
		checked ? "translate-x-5" : "translate-x-0.5"
	}`;

	const handleChange = (e: Event) => {
		if (disabled) return;
		const target = e.target as HTMLInputElement;
		const newChecked = target.checked;
		setChecked(newChecked);
		if (onChange) {
			onChange(newChecked);
		}
	};

	return (
		<label
			class={`inline-flex items-center gap-3 ${disabled ? "cursor-not-allowed" : "cursor-pointer"}`}
		>
			<span class="relative inline-flex items-center">
				<input
					type="checkbox"
					role="switch"
					id={id}
					name={name}
					checked={checked}
					aria-checked={checked}
					disabled={disabled}
					onChange={handleChange}
					class="peer sr-only"
				/>
				<span class={trackClassName} aria-hidden="true">
					<span class={thumbClassName} />
				</span>
			</span>
			{label && (
				<span
					class={`text-sm font-medium text-neutral-700 dark:text-neutral-300 select-none ${
						disabled ? "opacity-50" : ""
					}`}
				>
					{label}
				</span>
			)}
		</label>
	);
}
