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
		"mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm";
	const enabledClasses =
		"focus:outline-none focus:ring-orange-500 focus:border-orange-500";
	const disabledClasses = "bg-gray-100 text-gray-600";

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
				<label for={id} class="block text-sm font-medium text-gray-700">
					{label}
				</label>
				{input}
			</div>
		);
	}

	return input;
}
