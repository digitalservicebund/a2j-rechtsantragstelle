import { test, expect } from "@playwright/test";
import { CookieSettings } from "tests/e2e/domains/shared/CookieSettings";
import { csrfCountMax } from "~/services/security/csrf/csrfKey";
import { FluggastrechteVorabcheck } from "../domains/fluggastrechte/vorabcheck/FluggastrechteVorabcheck";

let vorabcheck: FluggastrechteVorabcheck;

test.beforeEach(async ({ page }) => {
  vorabcheck = new FluggastrechteVorabcheck(page);
  await vorabcheck.goto();

  const cookieSettings = new CookieSettings(page);
  await cookieSettings.acceptCookieBanner();
});

test.describe("CSRF token", () => {
  test("multiple tabs work", async ({ context }) => {
    const vorabcheck2 = new FluggastrechteVorabcheck(await context.newPage());
    await vorabcheck2.goto();
    await vorabcheck.clickNext();
    await vorabcheck.fillRadioPage("bereich", "verspaetet");
    await expect(
      vorabcheck.page.getByRole("heading").filter({ hasText: "Zielflughafen" }),
    ).toHaveCount(1);
  });

  test("N+1 non-form tabs still work", async ({ context }) => {
    for (let idx = 0; idx < csrfCountMax; idx++) {
      await (await context.newPage()).goto("/");
    }
    await vorabcheck.clickNext();
    await vorabcheck.fillRadioPage("bereich", "verspaetet");
    await expect(
      vorabcheck.page.getByRole("heading").filter({ hasText: "Zielflughafen" }),
    ).toHaveCount(1);
  });
});
