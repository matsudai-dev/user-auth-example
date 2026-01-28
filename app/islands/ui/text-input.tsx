import type { JSX } from "hono/jsx/jsx-runtime";

type TextInputProps = {
	id: string;
	label?: string;
	type?: "text" | "email" | "password";
	value?: string;
	onInput?: (e: Event) => void;
	placeholder?: string;
	required?: boolean;
	disabled?: boolean;
	color?: "default" | "primary" | "secondary" | "danger";
};

export function TextInput({
	id,
	label,
	type = "text",
	value,
	onInput,
	placeholder,
	required,
	disabled,
	color = "default",
}: TextInputProps): JSX.Element {
	const baseClasses =
		"mt-1 block w-full px-3 py-2 border rounded-md shadow-sm bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100";
	const disabledClasses =
		"bg-neutral-100 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-400";

	const colorClasses = {
		default:
			"border-neutral-300 dark:border-neutral-600 focus:outline-none focus:ring-neutral-500 focus:border-neutral-500 dark:focus:ring-neutral-400 dark:focus:border-neutral-400",
		primary:
			"border-emerald-300 dark:border-emerald-800 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 dark:focus:ring-emerald-400 dark:focus:border-emerald-400",
		secondary:
			"border-fuchsia-300 dark:border-fuchsia-800 focus:outline-none focus:ring-fuchsia-500 focus:border-fuchsia-500 dark:focus:ring-fuchsia-400 dark:focus:border-fuchsia-400",
		danger:
			"border-red-300 dark:border-red-800 focus:outline-none focus:ring-red-500 focus:border-red-500 dark:focus:ring-red-400 dark:focus:border-red-400",
	};

	const className = disabled
		? `${baseClasses} ${disabledClasses}`
		: `${baseClasses} ${colorClasses[color]}`;

	const input = (
		<input
			type={type}
			id={id}
			value={value}
			onInput={onInput}
			placeholder={placeholder}
			required={required}
			disabled={disabled}
			class={className}
		/>
	);

	if (label) {
		return (
			<div>
				<label
					for={id}
					class="block text-sm font-medium text-neutral-700 dark:text-neutral-300"
				>
					{label}
				</label>
				{input}
			</div>
		);
	}

	return input;
}
