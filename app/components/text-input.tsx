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
}: TextInputProps): JSX.Element {
	const baseClasses =
		"mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100";
	const enabledClasses =
		"focus:outline-none focus:ring-orange-500 focus:border-orange-500 dark:focus:ring-orange-400 dark:focus:border-orange-400";
	const disabledClasses =
		"bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400";

	const className = disabled
		? `${baseClasses} ${disabledClasses}`
		: `${baseClasses} ${enabledClasses}`;

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
