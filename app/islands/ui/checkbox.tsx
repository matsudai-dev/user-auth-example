import { useState } from "hono/jsx";
import type { JSX } from "hono/jsx/jsx-runtime";

type CheckboxProps = {
	id: string;
	defaultChecked?: boolean;
	disabled?: boolean;
	color?: "default" | "primary" | "secondary" | "danger";
	onChange?: (checked: boolean) => void;
	children?: JSX.Element | string;
};

export default function Checkbox({
	id,
	defaultChecked = false,
	disabled = false,
	color = "default",
	onChange,
	children,
}: CheckboxProps): JSX.Element {
	const [checked, setChecked] = useState(defaultChecked);

	const colorClasses = {
		default: {
			checkbox:
				"text-neutral-500 focus:ring-neutral-500 dark:focus:ring-neutral-400",
			label: "text-neutral-700 dark:text-neutral-300",
		},
		primary: {
			checkbox:
				"text-emerald-500 focus:ring-emerald-500 dark:focus:ring-emerald-400",
			label: "text-neutral-700 dark:text-neutral-300",
		},
		secondary: {
			checkbox:
				"text-fuchsia-500 focus:ring-fuchsia-500 dark:focus:ring-fuchsia-400",
			label: "text-neutral-700 dark:text-neutral-300",
		},
		danger: {
			checkbox: "text-red-500 focus:ring-red-500 dark:focus:ring-red-400",
			label: "text-neutral-700 dark:text-neutral-300",
		},
	};

	const baseCheckboxClasses =
		"h-4 w-4 border-neutral-300 dark:border-neutral-600 rounded bg-white dark:bg-neutral-800";
	const disabledClasses = disabled ? "opacity-50 cursor-not-allowed" : "";

	const checkboxClassName = `${baseCheckboxClasses} ${colorClasses[color].checkbox} ${disabledClasses}`;
	const labelClassName = `ml-2 block text-sm ${colorClasses[color].label} ${disabledClasses}`;

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
		<div class="flex items-center">
			<input
				type="checkbox"
				id={id}
				checked={checked}
				onChange={handleChange}
				disabled={disabled}
				class={checkboxClassName}
			/>
			{children && (
				<label for={id} class={labelClassName}>
					{children}
				</label>
			)}
		</div>
	);
}
