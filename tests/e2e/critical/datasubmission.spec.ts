import { test, expect } from "@playwright/test";
import { CookieSettings } from "../domains/shared/CookieSettings";

test.describe("Data submission", () => {
  test("radio group value is restored", async ({ page }) => {
    await page.goto("/beratungshilfe/vorabcheck");
    const cookieSettings = new CookieSettings(page);
    await cookieSettings.acceptCookieBanner();

    await page.getByLabel("Ja").click();
    await page.getByText("Weiter").click();
    await expect(
      page.getByText("wahrscheinlich keine Beratungshilfe"),
    ).toBeVisible();
    await page.getByRole("link", { name: "Zurück", exact: true }).click();
    await expect(page.getByLabel("Ja")).toBeChecked();
  });
});
