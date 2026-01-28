import { expect, test } from "@playwright/test";
import Mailosaur from "mailosaur";

const MAILOSAUR_SERVER_ID = process.env.MAILOSAUR_SERVER_ID ?? "";
const MAILOSAUR_API_KEY = process.env.MAILOSAUR_API_KEY ?? "";

test.describe("Signup and Login Happy Path", () => {
	test("should complete full signup, logout, and login flow", async ({
		page,
	}) => {
		const mailosaur = new Mailosaur(MAILOSAUR_API_KEY);
		const testEmail = `test-${Date.now()}@${MAILOSAUR_SERVER_ID}.mailosaur.net`;
		const testPassword = "TestPass123!";

		// 1. Access top page
		await page.goto("/");
		await expect(page.locator("h1")).toHaveText("ホーム");

		// 2. Navigate to signup page via "新規登録" link
		await page.click('[data-testid="signup-link"]');
		await expect(page.locator("h1")).toHaveText("新規登録");

		// 3. Verify submit button is disabled when email is invalid
		const signupEmailInput = page.locator("#signup-email");
		const signupSubmitButton = page.locator("#signup-submit");

		// Enter invalid email and check button state via form validation
		await signupEmailInput.fill("invalid-email");
		await signupSubmitButton.click();
		// Form should not submit due to browser validation - still on signup page
		await expect(page.locator("h1")).toHaveText("新規登録");

		// 4. Submit signup form with valid email
		await signupEmailInput.fill(testEmail);
		await signupSubmitButton.click();

		// Wait for success message
		await expect(
			page.locator("text=確認メールを送信しました。メールをご確認ください。"),
		).toBeVisible({ timeout: 10000 });

		// 5. Retrieve verification email from Mailosaur and extract verification link
		const email = await mailosaur.messages.get(MAILOSAUR_SERVER_ID, {
			sentTo: testEmail,
		});

		expect(email.html?.links).toBeDefined();
		const verifyLink = email.html?.links?.find((link) =>
			link.href?.includes("/signup/verify"),
		);
		expect(verifyLink?.href).toBeDefined();

		// 6. Access verification link and confirm email is displayed
		await page.goto(verifyLink?.href ?? "");
		await expect(page.locator("h1")).toHaveText("パスワード設定");

		const displayedEmail = page.locator("#signup-verify-email");
		await expect(displayedEmail).toHaveValue(testEmail);

		// 7. Set password and complete registration
		await page.locator("#signup-verify-password").fill(testPassword);
		await page.locator("#signup-verify-password-confirm").fill(testPassword);

		const registerButton = page.locator("#signup-verify-submit");
		await expect(registerButton).toBeEnabled();
		await registerButton.click();

		// Wait for navigation to complete after registration
		await page.waitForURL("/", { timeout: 10000 });

		// 8. Verify automatic redirect to top page with email displayed
		await expect(page.locator("h1")).toHaveText("ホーム");
		await expect(page.locator("#logged-in-email")).toContainText(testEmail);

		// 9. Navigate to settings page via link
		await page.click('[data-testid="settings-link"]');
		await expect(page.locator("h1")).toHaveText("設定");
		await expect(page.locator("#settings-email")).toHaveText(testEmail);

		// 10. Click logout button and verify redirect to top page
		await page.click("#logout-button");
		await page.waitForURL("/", { timeout: 10000 });
		await expect(page.locator("h1")).toHaveText("ホーム");
		await expect(page.locator('[data-testid="login-link"]')).toBeVisible();

		// 11. Navigate to login page via link
		await page.click('[data-testid="login-link"]');
		await expect(page.locator("h1")).toHaveText("ログイン");

		// 12. Login with email and password
		// Wait for login form to be hydrated (interactive)
		await page.waitForSelector("#login-form", { state: "attached" });

		await page.locator("#login-email").fill(testEmail);
		await page.locator("#login-password").fill(testPassword);
		await page.locator("#login-submit").click();

		// Wait for navigation to complete after login
		await page.waitForURL("/", { timeout: 10000 });

		// Verify successful login and email displayed on top page
		await expect(page.locator("h1")).toHaveText("ホーム");
		await expect(page.locator("#logged-in-email")).toContainText(testEmail);

		// 13. Delete signup email before password reset test
		if (email.id) {
			await mailosaur.messages.del(email.id);
		}

		// 14. Navigate to settings and logout again for password reset test
		await page.click('[data-testid="settings-link"]');
		await expect(page.locator("h1")).toHaveText("設定");
		await page.click("#logout-button");
		await page.waitForURL("/", { timeout: 10000 });

		// 15. Navigate to password reset page via login page
		await page.click('[data-testid="login-link"]');
		await expect(page.locator("h1")).toHaveText("ログイン");
		await page.click('a[href="/password-reset"]');
		await expect(page.locator("h1")).toHaveText("パスワードリセット");

		// 16. Submit password reset form
		// Wait for password reset form to be hydrated (interactive)
		await page.waitForSelector("#password-reset-form", { state: "attached" });
		await page.locator("#password-reset-email").fill(testEmail);
		await page.locator("#password-reset-submit").click();

		// Wait for success message
		await expect(
			page.locator(
				"text=パスワードリセット用のメールを送信しました。メールをご確認ください。",
			),
		).toBeVisible({ timeout: 10000 });

		// 17. Retrieve password reset email from Mailosaur and extract reset link
		const resetEmail = await mailosaur.messages.get(MAILOSAUR_SERVER_ID, {
			sentTo: testEmail,
		});

		expect(resetEmail.html?.links).toBeDefined();
		const resetLink = resetEmail.html?.links?.find((link) =>
			link.href?.includes("/password-reset/verify"),
		);
		expect(resetLink?.href).toBeDefined();

		// 18. Access reset link and set new password
		await page.goto(resetLink?.href ?? "");
		await expect(page.locator("h1")).toHaveText("パスワード再設定");

		const displayedResetEmail = page.locator("#password-reset-verify-email");
		await expect(displayedResetEmail).toHaveValue(testEmail);

		const newPassword = "NewTestPass456!";
		await page.locator("#password-reset-verify-password").fill(newPassword);
		await page
			.locator("#password-reset-verify-password-confirm")
			.fill(newPassword);

		const resetSubmitButton = page.locator("#password-reset-verify-submit");
		await expect(resetSubmitButton).toBeEnabled();
		await resetSubmitButton.click();

		// Wait for navigation to login page after password reset
		await page.waitForURL("/login", { timeout: 10000 });
		await expect(page.locator("h1")).toHaveText("ログイン");

		// 19. Login with new password
		await page.locator("#login-email").fill(testEmail);
		await page.locator("#login-password").fill(newPassword);
		await page.locator("#login-submit").click();

		// Wait for navigation to complete after login
		await page.waitForURL("/", { timeout: 10000 });

		// Verify successful login with new password
		await expect(page.locator("h1")).toHaveText("ホーム");
		await expect(page.locator("#logged-in-email")).toContainText(testEmail);

		// Cleanup: delete the password reset email
		if (resetEmail.id) {
			await mailosaur.messages.del(resetEmail.id);
		}
	});
});
