import { PASSWORD_MIN_LENGTH } from "@/consts";

export type PasswordValidationResult = {
	isMinLength: boolean;
	hasLowercase: boolean;
	hasUppercase: boolean;
	hasNumber: boolean;
	hasSymbol: boolean;
	hasThreeTypes: boolean;
	isNotSimilarToEmail: boolean;
	isValid: boolean;
};

export function checkPasswordMinLength(password: string): boolean {
	return password.length >= PASSWORD_MIN_LENGTH;
}

export function checkPasswordHasLowercase(password: string): boolean {
	return /[a-z]/.test(password);
}

export function checkPasswordHasUppercase(password: string): boolean {
	return /[A-Z]/.test(password);
}

export function checkPasswordHasNumber(password: string): boolean {
	return /[0-9]/.test(password);
}

export function checkPasswordHasSymbol(password: string): boolean {
	return /[^a-zA-Z0-9]/.test(password);
}

export function checkPasswordHasThreeTypes(password: string): boolean {
	let typeCount = 0;
	if (checkPasswordHasLowercase(password)) typeCount++;
	if (checkPasswordHasUppercase(password)) typeCount++;
	if (checkPasswordHasNumber(password)) typeCount++;
	if (checkPasswordHasSymbol(password)) typeCount++;
	return typeCount >= 3;
}

export function checkPasswordNotSimilarToEmail(
	password: string,
	email: string,
): boolean {
	const emailLocalPart = email.split("@")[0]?.toLowerCase() ?? "";
	if (
		emailLocalPart.length >= 3 &&
		password.toLowerCase().includes(emailLocalPart)
	) {
		return false;
	}
	return true;
}

export function validatePassword(
	password: string,
	email: string,
): PasswordValidationResult {
	const isMinLength = checkPasswordMinLength(password);
	const hasLowercase = checkPasswordHasLowercase(password);
	const hasUppercase = checkPasswordHasUppercase(password);
	const hasNumber = checkPasswordHasNumber(password);
	const hasSymbol = checkPasswordHasSymbol(password);
	const hasThreeTypes = checkPasswordHasThreeTypes(password);
	const isNotSimilarToEmail = checkPasswordNotSimilarToEmail(password, email);

	const isValid = isMinLength && hasThreeTypes && isNotSimilarToEmail;

	return {
		isMinLength,
		hasLowercase,
		hasUppercase,
		hasNumber,
		hasSymbol,
		hasThreeTypes,
		isNotSimilarToEmail,
		isValid,
	};
}
