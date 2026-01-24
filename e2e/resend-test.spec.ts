import { expect, test } from "@playwright/test";

test.describe("Home Page", () => {
	test("should display the correct heading", async ({ page }) => {
		await page.goto("/");

		const heading = page.locator("h1");
		await expect(heading).toHaveText("Hello, Developer!");
	});
});
