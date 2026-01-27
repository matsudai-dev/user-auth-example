import { PASSWORD_MIN_LENGTH } from "@/consts";

/** Result of password validation containing individual check results */
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

/**
 * Checks if the password meets the minimum length requirement.
 *
 * @param password - The password to validate
 * @returns True if the password length is at least PASSWORD_MIN_LENGTH (8 characters)
 */
export function checkPasswordMinLength(password: string): boolean {
	return password.length >= PASSWORD_MIN_LENGTH;
}

/**
 * Checks if the password contains at least one lowercase letter (a-z).
 *
 * @param password - The password to validate
 * @returns True if the password contains a lowercase letter
 */
export function checkPasswordHasLowercase(password: string): boolean {
	return /[a-z]/.test(password);
}

/**
 * Checks if the password contains at least one uppercase letter (A-Z).
 *
 * @param password - The password to validate
 * @returns True if the password contains an uppercase letter
 */
export function checkPasswordHasUppercase(password: string): boolean {
	return /[A-Z]/.test(password);
}

/**
 * Checks if the password contains at least one numeric digit (0-9).
 *
 * @param password - The password to validate
 * @returns True if the password contains a number
 */
export function checkPasswordHasNumber(password: string): boolean {
	return /[0-9]/.test(password);
}

/**
 * Checks if the password contains at least one symbol (non-alphanumeric character).
 *
 * @param password - The password to validate
 * @returns True if the password contains a symbol
 */
export function checkPasswordHasSymbol(password: string): boolean {
	return /[^a-zA-Z0-9]/.test(password);
}

/**
 * Checks if the password contains at least three different character types.
 * Character types: lowercase, uppercase, numbers, symbols.
 *
 * @param password - The password to validate
 * @returns True if the password contains at least 3 of the 4 character types
 */
export function checkPasswordHasThreeTypes(password: string): boolean {
	let typeCount = 0;
	if (checkPasswordHasLowercase(password)) typeCount++;
	if (checkPasswordHasUppercase(password)) typeCount++;
	if (checkPasswordHasNumber(password)) typeCount++;
	if (checkPasswordHasSymbol(password)) typeCount++;
	return typeCount >= 3;
}

/**
 * Checks if the password is not similar to the email address.
 * Returns false if the email's local part (before @) is 3+ characters
 * and the password contains it (case-insensitive).
 *
 * @param password - The password to validate
 * @param email - The user's email address
 * @returns True if the password does not contain the email's local part
 */
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

/**
 * Validates a password against all security requirements.
 * A valid password must:
 * - Be at least 8 characters long
 * - Contain at least 3 of 4 character types (lowercase, uppercase, numbers, symbols)
 * - Not contain the email's local part (if 3+ characters)
 *
 * @param password - The password to validate
 * @param email - The user's email address for similarity check
 * @returns Object containing individual check results and overall validity
 */
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
