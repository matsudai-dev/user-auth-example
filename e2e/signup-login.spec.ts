import { expect, test } from "@playwright/test";
import Mailosaur from "mailosaur";

const MAILOSAUR_SERVER_ID = process.env.MAILOSAUR_SERVER_ID;
const MAILOSAUR_API_KEY = process.env.MAILOSAUR_API_KEY;

if (!MAILOSAUR_SERVER_ID || !MAILOSAUR_API_KEY) {
	throw new Error("Environment variables must be set");
}

class Section {
	static log(text: string): void {
		console.log(`\x1b[1;33m${text}\x1b[0m`);
	}
}

test.describe("Signup and Login Happy Path", () => {
	test("should complete full signup, logout, and login flow", async ({
		page,
	}) => {
		const mailosaur = new Mailosaur(MAILOSAUR_API_KEY);
		const testEmail = `test-${Date.now()}@${MAILOSAUR_SERVER_ID}.mailosaur.net`;
		const testPassword = "TestPass123!";

		Section.log("1. Access top page");
		await page.goto("/");

		Section.log("2. Navigate to signup page via link");
		await page.getByTestId("signup-link").click();
		await page.waitForURL("/signup", { timeout: 10000 });
		await page.waitForTimeout(1000);

		Section.log("3. Submit signup form with valid email");
		const signupEmailInput = page.locator("#signup-email");
		await expect(async () => {
			await signupEmailInput.fill(testEmail);
			await expect(signupEmailInput).toHaveValue(testEmail);
		}).toPass({ timeout: 10000 });

		const signupSubmitButton = page.locator("#signup-submit");
		await signupSubmitButton.click();

		await expect(
			page.locator("text=確認メールを送信しました。メールをご確認ください。"),
		).toBeVisible({ timeout: 30000 }); // TODO: data-testid を追加する

		Section.log("4. Retrieve verification email from Mailosaur and extract verification link");
		const email = await mailosaur.messages.get(MAILOSAUR_SERVER_ID, {
			sentTo: testEmail,
		});

		expect(email.html?.links).toBeDefined();
		const verifyLink = email.html?.links?.find((link) =>
			link.href?.includes("/signup/verify"),
		);
		expect(verifyLink?.href).toBeDefined();

		Section.log("5. Access verification link and confirm email is displayed");
		await page.goto(verifyLink?.href ?? "");
		await page.waitForTimeout(1000);

		const displayedEmail = page.locator("#signup-verify-email");
		await expect(displayedEmail).toHaveValue(testEmail);

		Section.log("6. Set password and complete registration");
		const signupPasswordInput = page.locator("#signup-verify-password");
		await expect(async () => {
			await signupPasswordInput.fill(testPassword);
			await expect(signupPasswordInput).toHaveValue(testPassword);
		}).toPass({ timeout: 10000 });

		const signupPasswordConfirmInput = page.locator(
			"#signup-verify-password-confirm",
		);
		await expect(async () => {
			await signupPasswordConfirmInput.fill(testPassword);
			await expect(signupPasswordConfirmInput).toHaveValue(testPassword);
		}).toPass({ timeout: 10000 });

		const registerButton = page.locator("#signup-verify-submit");
		await registerButton.click();

		await page.waitForURL("/", { timeout: 10000 });
		await page.waitForTimeout(1000);

		Section.log("7. Verify automatic redirect to top page with email displayed");
		await expect(page.locator("#logged-in-email")).toContainText(testEmail);

		Section.log("8. Navigate to settings page via link");
		await page.getByTestId("settings-link").click();
		await page.waitForURL("/settings", { timeout: 10000 });
		await page.waitForTimeout(1000);

		await expect(page.locator("#settings-email")).toHaveText(testEmail);

		Section.log("9. Click logout button and verify redirect to top page");
		await page.click("#logout-button");
		await page.waitForURL("/", { timeout: 10000 });
		await page.waitForTimeout(1000);

		Section.log("10. Navigate to login page via link");
		await page.getByTestId("login-link").click();
		await page.waitForURL("/login", { timeout: 10000 });
		await page.waitForTimeout(1000);

		Section.log("11. Login with email and password");
		await page.waitForSelector("#login-form", { state: "attached" });
		await page.waitForTimeout(1000);

		const loginEmailInput11 = page.locator("#login-email");
		await expect(async () => {
			await loginEmailInput11.fill(testEmail);
			await expect(loginEmailInput11).toHaveValue(testEmail);
		}).toPass({ timeout: 10000 });
		await page.locator("#login-password").fill(testPassword);

		await page.locator("#login-submit").click();
		await page.waitForURL("/", { timeout: 10000 });
		await page.waitForTimeout(1000);

		await expect(page.locator("#logged-in-email")).toContainText(testEmail);

		Section.log("12. Delete signup email before password reset test");
		if (email.id) {
			await mailosaur.messages.del(email.id);
		}

		Section.log("13. Navigate to settings and logout again for password reset test");
		await page.getByTestId("settings-link").click();
		await page.waitForURL("/settings", { timeout: 10000 });
		await page.waitForTimeout(1000);

		await page.click("#logout-button");
		await page.waitForURL("/", { timeout: 10000 });
		await page.waitForTimeout(1000);

		Section.log("14. Navigate to password reset page via login page");
		await page.getByTestId("login-link").click();
		await page.waitForURL("/login", { timeout: 10000 });
		await page.waitForTimeout(1000);

		await page.click('a[href="/password-reset"]'); // TODO: data-testid を追加する
		await page.waitForURL("/password-reset", { timeout: 10000 });
		await page.waitForTimeout(1000);

		Section.log("15. Submit password reset form");
		await page.waitForSelector("#password-reset-form", { state: "attached" });
		await page.waitForTimeout(1000);

		const resetEmailInput = page.locator("#password-reset-email");
		await expect(async () => {
			await resetEmailInput.fill(testEmail);
			await expect(resetEmailInput).toHaveValue(testEmail);
		}).toPass({ timeout: 10000 });
		await page.locator("#password-reset-submit").click();

		await expect(
			page.locator(
				"text=パスワードリセット用のメールを送信しました。メールをご確認ください。",
			),
		).toBeVisible({ timeout: 30000 }); // TODO: data-testid を追加する

		Section.log("16. Retrieve password reset email from Mailosaur and extract reset link");
		const resetEmail = await mailosaur.messages.get(MAILOSAUR_SERVER_ID, {
			sentTo: testEmail,
		});

		expect(resetEmail.html?.links).toBeDefined();
		const resetLink = resetEmail.html?.links?.find((link) =>
			link.href?.includes("/password-reset/verify"),
		);

		if (resetEmail.id) {
			await mailosaur.messages.del(resetEmail.id);
		}

		Section.log("17. Access reset link and set new password");
		await page.goto(resetLink?.href ?? "");
		await page.waitForTimeout(1000);

		const displayedResetEmail = page.locator("#password-reset-verify-email");
		await expect(displayedResetEmail).toHaveValue(testEmail);

		const newPassword = "NewTestPass456!";

		const resetPasswordInput = page.locator("#password-reset-verify-password");
		await expect(async () => {
			await resetPasswordInput.fill(newPassword);
			await expect(resetPasswordInput).toHaveValue(newPassword);
		}).toPass({ timeout: 10000 });

		const resetPasswordConfirmInput = page.locator(
			"#password-reset-verify-password-confirm",
		);
		await expect(async () => {
			await resetPasswordConfirmInput.fill(newPassword);
			await expect(resetPasswordConfirmInput).toHaveValue(newPassword);
		}).toPass({ timeout: 10000 });

		const resetSubmitButton = page.locator("#password-reset-verify-submit");
		await resetSubmitButton.click();

		await page.waitForURL("/login", { timeout: 10000 });
		await page.waitForTimeout(1000);

		Section.log("18. Login with new password");
		const loginEmailInput18 = page.locator("#login-email");
		await expect(async () => {
			await loginEmailInput18.fill(testEmail);
			await expect(loginEmailInput18).toHaveValue(testEmail);
		}).toPass({ timeout: 10000 });

		const loginPasswordInput = page.locator("#login-password");
		await expect(async () => {
			await loginPasswordInput.fill(newPassword);
			await expect(loginPasswordInput).toHaveValue(newPassword);
		}).toPass({ timeout: 10000 });

		await page.locator("#login-submit").click();

		await page.waitForURL("/", { timeout: 10000 });
		await page.waitForTimeout(1000);

		await expect(page.locator("#logged-in-email")).toContainText(testEmail);

		Section.log("19. Navigate to settings page for password change test");
		await page.getByTestId("settings-link").click();
		await page.waitForURL("/settings", { timeout: 10000 });
		await page.waitForTimeout(1000);

		Section.log("20. Change password via settings form");
		const changedPassword = "ChangedPass789!";

		await page.waitForSelector("#password-change-form", { state: "attached" });
		await page.waitForTimeout(1000);

		const currentPasswordInput = page.locator("#password-change-current");
		await expect(async () => {
			await currentPasswordInput.fill(newPassword);
			await expect(currentPasswordInput).toHaveValue(newPassword);
		}).toPass({ timeout: 10000 });

		const newPasswordInput = page.locator("#password-change-new");
		await expect(async () => {
			await newPasswordInput.fill(changedPassword);
			await expect(newPasswordInput).toHaveValue(changedPassword);
		}).toPass({ timeout: 10000 });

		const confirmPasswordInput = page.locator("#password-change-new-confirm");
		await expect(async () => {
			await confirmPasswordInput.fill(changedPassword);
			await expect(confirmPasswordInput).toHaveValue(changedPassword);
		}).toPass({ timeout: 10000 });

		const passwordChangeSubmit = page.locator("#password-change-submit");
		await passwordChangeSubmit.click();

		await expect(page.locator("text=パスワードを変更しました")).toBeVisible({
			timeout: 10000,
		}); // TODO: data-testid を追加する

		Section.log("21. Logout after password change");
		await page.click("#logout-button");
		await page.waitForURL("/", { timeout: 10000 });
		await page.waitForTimeout(1000);

		Section.log("22. Login with changed password");
		await page.getByTestId("login-link").click();
		await page.waitForURL("/login", { timeout: 10000 });
		await page.waitForTimeout(1000);

		await page.waitForSelector("#login-form", { state: "attached" });
		await page.waitForTimeout(1000);

		const loginEmailInput22 = page.locator("#login-email");
		await expect(async () => {
			await loginEmailInput22.fill(testEmail);
			await expect(loginEmailInput22).toHaveValue(testEmail);
		}).toPass({ timeout: 10000 });

		const loginPasswordInput22 = page.locator("#login-password");
		await expect(async () => {
			await loginPasswordInput22.fill(changedPassword);
			await expect(loginPasswordInput22).toHaveValue(changedPassword);
		}).toPass({ timeout: 10000 });

		await page.locator("#login-submit").click();
		await page.waitForURL("/", { timeout: 10000 });
		await page.waitForTimeout(1000);

		await expect(page.locator("#logged-in-email")).toContainText(testEmail);

		Section.log("23. Navigate to settings page for account deletion");
		await page.getByTestId("settings-link").click();
		await page.waitForURL("/settings", { timeout: 10000 });

		Section.log("24. Delete account via settings form");
		await page.waitForSelector("#account-delete-form", { state: "attached" });
		await page.waitForTimeout(1000);

		const deletePasswordInput = page.locator("#account-delete-password");
		await expect(async () => {
			await deletePasswordInput.fill(changedPassword);
			await expect(deletePasswordInput).toHaveValue(changedPassword);
		}).toPass({ timeout: 10000 });

		const accountDeleteSubmit = page.locator("#account-delete-submit");
		await accountDeleteSubmit.click();

		await page.waitForURL("/", { timeout: 10000 });
		await page.waitForTimeout(1000);

		Section.log("25. Verify login with deleted account fails");
		await page.getByTestId("login-link").click();
		await page.waitForURL("/login", { timeout: 10000 });
		await page.waitForTimeout(1000);

		await page.waitForSelector("#login-form", { state: "attached" });
		await page.waitForTimeout(1000);

		const loginEmailInput25 = page.locator("#login-email");
		await expect(async () => {
			await loginEmailInput25.fill(testEmail);
			await expect(loginEmailInput25).toHaveValue(testEmail);
		}).toPass({ timeout: 10000 });

		const loginPasswordInput25 = page.locator("#login-password");
		await expect(async () => {
			await loginPasswordInput25.fill(changedPassword);
			await expect(loginPasswordInput25).toHaveValue(changedPassword);
		}).toPass({ timeout: 10000 });

		await page.locator("#login-submit").click();

		await expect(
			page.locator("text=メールアドレスまたはパスワードが正しくありません"),
		).toBeVisible({
			timeout: 10000,
		}); // TODO: data-testid を追加する
	});
});
