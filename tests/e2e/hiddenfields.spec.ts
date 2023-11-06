import { test, expect } from "@playwright/test";
import { BeratungshilfeVorabcheck } from "./pom/BeratungshilfeVorabcheck";

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

        // Try to submit without selecting an option
        const nextButton = page.getByRole("button", {
          name: "Übernehmen & weiter",
        });
        await nextButton.click();

        // Check if validation message is visible
        await page.locator("#rechtsschutzversicherung-error").isVisible();
      });
    });
  });
});
