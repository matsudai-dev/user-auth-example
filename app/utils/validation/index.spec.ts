import { describe, expect, it } from "bun:test";
import {
	checkPasswordHasLowercase,
	checkPasswordHasNumber,
	checkPasswordHasSymbol,
	checkPasswordHasThreeTypes,
	checkPasswordHasUppercase,
	checkPasswordMinLength,
	checkPasswordNotSimilarToEmail,
	validatePassword,
} from "./index";

describe("checkPasswordMinLength", () => {
	it("should return true for password with exactly 8 characters", () => {
		const result = checkPasswordMinLength("12345678");

		expect(result).toBe(true);
	});

	it("should return true for password longer than 8 characters", () => {
		const result = checkPasswordMinLength("123456789");

		expect(result).toBe(true);
	});

	it("should return false for password with 7 characters", () => {
		const result = checkPasswordMinLength("1234567");

		expect(result).toBe(false);
	});

	it("should return false for empty password", () => {
		const result = checkPasswordMinLength("");

		expect(result).toBe(false);
	});
});

describe("checkPasswordHasLowercase", () => {
	it("should return true for password with lowercase letter", () => {
		const result = checkPasswordHasLowercase("Password");

		expect(result).toBe(true);
	});

	it("should return false for password without lowercase letter", () => {
		const result = checkPasswordHasLowercase("PASSWORD123");

		expect(result).toBe(false);
	});

	it("should return false for empty password", () => {
		const result = checkPasswordHasLowercase("");

		expect(result).toBe(false);
	});
});

describe("checkPasswordHasUppercase", () => {
	it("should return true for password with uppercase letter", () => {
		const result = checkPasswordHasUppercase("Password");

		expect(result).toBe(true);
	});

	it("should return false for password without uppercase letter", () => {
		const result = checkPasswordHasUppercase("password123");

		expect(result).toBe(false);
	});

	it("should return false for empty password", () => {
		const result = checkPasswordHasUppercase("");

		expect(result).toBe(false);
	});
});

describe("checkPasswordHasNumber", () => {
	it("should return true for password with number", () => {
		const result = checkPasswordHasNumber("Password1");

		expect(result).toBe(true);
	});

	it("should return false for password without number", () => {
		const result = checkPasswordHasNumber("Password");

		expect(result).toBe(false);
	});

	it("should return false for empty password", () => {
		const result = checkPasswordHasNumber("");

		expect(result).toBe(false);
	});
});

describe("checkPasswordHasSymbol", () => {
	it("should return true for password with symbol", () => {
		const result = checkPasswordHasSymbol("Password!");

		expect(result).toBe(true);
	});

	it("should return true for password with various symbols", () => {
		expect(checkPasswordHasSymbol("pass@word")).toBe(true);
		expect(checkPasswordHasSymbol("pass#word")).toBe(true);
		expect(checkPasswordHasSymbol("pass$word")).toBe(true);
		expect(checkPasswordHasSymbol("pass_word")).toBe(true);
		expect(checkPasswordHasSymbol("pass-word")).toBe(true);
	});

	it("should return false for password without symbol", () => {
		const result = checkPasswordHasSymbol("Password123");

		expect(result).toBe(false);
	});

	it("should return false for empty password", () => {
		const result = checkPasswordHasSymbol("");

		expect(result).toBe(false);
	});
});

describe("checkPasswordHasThreeTypes", () => {
	it("should return true for password with lowercase, uppercase, and number", () => {
		const result = checkPasswordHasThreeTypes("Password1");

		expect(result).toBe(true);
	});

	it("should return true for password with lowercase, uppercase, and symbol", () => {
		const result = checkPasswordHasThreeTypes("Password!");

		expect(result).toBe(true);
	});

	it("should return true for password with lowercase, number, and symbol", () => {
		const result = checkPasswordHasThreeTypes("password1!");

		expect(result).toBe(true);
	});

	it("should return true for password with uppercase, number, and symbol", () => {
		const result = checkPasswordHasThreeTypes("PASSWORD1!");

		expect(result).toBe(true);
	});

	it("should return true for password with all four types", () => {
		const result = checkPasswordHasThreeTypes("Password1!");

		expect(result).toBe(true);
	});

	it("should return false for password with only two types", () => {
		expect(checkPasswordHasThreeTypes("password1")).toBe(false);
		expect(checkPasswordHasThreeTypes("Password")).toBe(false);
		expect(checkPasswordHasThreeTypes("12345678")).toBe(false);
	});

	it("should return false for password with only one type", () => {
		expect(checkPasswordHasThreeTypes("password")).toBe(false);
		expect(checkPasswordHasThreeTypes("PASSWORD")).toBe(false);
	});

	it("should return false for empty password", () => {
		const result = checkPasswordHasThreeTypes("");

		expect(result).toBe(false);
	});
});

describe("checkPasswordNotSimilarToEmail", () => {
	it("should return true when password does not contain email local part", () => {
		const result = checkPasswordNotSimilarToEmail(
			"SecurePass1!",
			"user@example.com",
		);

		expect(result).toBe(true);
	});

	it("should return false when password contains email local part", () => {
		const result = checkPasswordNotSimilarToEmail(
			"userPassword1!",
			"user@example.com",
		);

		expect(result).toBe(false);
	});

	it("should be case-insensitive", () => {
		const result = checkPasswordNotSimilarToEmail(
			"USERPassword1!",
			"user@example.com",
		);

		expect(result).toBe(false);
	});

	it("should return true when email local part is less than 3 characters", () => {
		const result = checkPasswordNotSimilarToEmail(
			"abPassword1!",
			"ab@example.com",
		);

		expect(result).toBe(true);
	});

	it("should return false when password contains email local part of exactly 3 characters", () => {
		const result = checkPasswordNotSimilarToEmail(
			"abcPassword1!",
			"abc@example.com",
		);

		expect(result).toBe(false);
	});

	it("should handle email without @ symbol", () => {
		const result = checkPasswordNotSimilarToEmail(
			"SecurePass1!",
			"invalidEmail",
		);

		expect(result).toBe(true);
	});

	it("should handle empty email", () => {
		const result = checkPasswordNotSimilarToEmail("SecurePass1!", "");

		expect(result).toBe(true);
	});
});

describe("validatePassword", () => {
	it("should return valid for password meeting all requirements", () => {
		const result = validatePassword("SecurePass1!", "user@example.com");

		expect(result.isValid).toBe(true);
		expect(result.isMinLength).toBe(true);
		expect(result.hasLowercase).toBe(true);
		expect(result.hasUppercase).toBe(true);
		expect(result.hasNumber).toBe(true);
		expect(result.hasSymbol).toBe(true);
		expect(result.hasThreeTypes).toBe(true);
		expect(result.isNotSimilarToEmail).toBe(true);
	});

	it("should return invalid for password too short", () => {
		const result = validatePassword("Pass1!", "user@example.com");

		expect(result.isValid).toBe(false);
		expect(result.isMinLength).toBe(false);
	});

	it("should return invalid for password with only two character types", () => {
		const result = validatePassword("password12", "user@example.com");

		expect(result.isValid).toBe(false);
		expect(result.hasThreeTypes).toBe(false);
	});

	it("should return invalid for password similar to email", () => {
		const result = validatePassword("userPass1!", "user@example.com");

		expect(result.isValid).toBe(false);
		expect(result.isNotSimilarToEmail).toBe(false);
	});

	it("should return all individual check results", () => {
		const result = validatePassword("abcdefgh", "user@example.com");

		expect(result.isMinLength).toBe(true);
		expect(result.hasLowercase).toBe(true);
		expect(result.hasUppercase).toBe(false);
		expect(result.hasNumber).toBe(false);
		expect(result.hasSymbol).toBe(false);
		expect(result.hasThreeTypes).toBe(false);
		expect(result.isNotSimilarToEmail).toBe(true);
		expect(result.isValid).toBe(false);
	});

	it("should handle empty password", () => {
		const result = validatePassword("", "user@example.com");

		expect(result.isValid).toBe(false);
		expect(result.isMinLength).toBe(false);
		expect(result.hasThreeTypes).toBe(false);
	});
});
