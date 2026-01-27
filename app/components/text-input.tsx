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
		"mt-1 block w-full px-3 py-2 border rounded-md shadow-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100";
	const disabledClasses =
		"bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400";

	const colorClasses = {
		default:
			"border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-orange-500 focus:border-orange-500 dark:focus:ring-orange-400 dark:focus:border-orange-400",
		primary:
			"border-blue-300 dark:border-blue-600 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400",
		secondary:
			"border-purple-300 dark:border-purple-600 focus:outline-none focus:ring-purple-500 focus:border-purple-500 dark:focus:ring-purple-400 dark:focus:border-purple-400",
		danger:
			"border-red-300 dark:border-red-600 focus:outline-none focus:ring-red-500 focus:border-red-500 dark:focus:ring-red-400 dark:focus:border-red-400",
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
					class="block text-sm font-medium text-gray-700 dark:text-gray-300"
				>
					{label}
				</label>
				{input}
			</div>
		);
	}

	return input;
}
