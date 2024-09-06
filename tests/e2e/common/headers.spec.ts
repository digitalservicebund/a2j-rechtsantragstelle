import { test, expect } from "@playwright/test";
import { CookieSettings } from "tests/e2e/pom/CookieSettings";

test.describe("Cache-Control", () => {
  test("should dismiss cookie banner when cookie is accepted/rejected", async ({
    page,
  }) => {
    await page.goto("/");
    const cookieSettings = new CookieSettings(page);
    await cookieSettings.acceptCookieBanner();

    await page.goto("/fluggastrechte");
    await page.goBack();
    const cookieBanner = page.getByTestId("cookie-banner");
    await expect(cookieBanner).not.toBeVisible();
  });
  test("should keep banner when cookie is not accepted/rejected", async ({
    page,
  }) => {
    await page.goto("/");
    await page.goto("/fluggastrechte");
    await page.goBack();
    const cookieBanner = page.getByTestId("cookie-banner");
    await expect(cookieBanner).toBeVisible();
  });
});
