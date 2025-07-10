import { test, expect } from "@playwright/test";
import { BeratungshilfeVorabcheck } from "tests/e2e/domains/beratungshilfe/vorabcheck/BeratungshilfeVorabcheck";

const nextButtonName = "_action";

test.describe("Hidden fields", () => {
  test.describe("when js is disabled", () => {
    test.use({ javaScriptEnabled: false });
    test.describe("for RadioGroups", () => {
      test("validation should work", async ({ page }) => {
        const vorabcheck = new BeratungshilfeVorabcheck(page);
        await vorabcheck.goto();

        // Accept cookies to submit form in the vorabcheck
        await page.getByRole("button", { name: "Akzeptieren" }).click();
        await vorabcheck.goto();
        await page.locator(`button[name="${nextButtonName}"]`).click();

        // Try to submit without selecting an option
        const nextButton = page.locator(`button[name="${nextButtonName}"]`);
        await nextButton.click();

        // Check if validation message is visible
        await expect(
          page.locator("#rechtsschutzversicherung-error"),
        ).toBeVisible();
      });
    });
  });
});
