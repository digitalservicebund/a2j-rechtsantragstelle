import { test, expect } from "@playwright/test";
import { BeratungshilfeVorabcheck } from "tests/e2e/domains/beratungshilfe/vorabcheck/BeratungshilfeVorabcheck";
import { CookieSettings } from "tests/e2e/domains/shared/CookieSettings";
import { csrfCountMax } from "~/services/security/csrf/csrfKey";

let vorabcheck: BeratungshilfeVorabcheck;

test.beforeEach(async ({ page }) => {
  vorabcheck = new BeratungshilfeVorabcheck(page);
  await vorabcheck.goto();

  const cookieSettings = new CookieSettings(page);
  await cookieSettings.acceptCookieBanner();
});

test.describe("CSRF token", () => {
  test("multiple tabs work", async ({ context }) => {
    const vorabcheck2 = new BeratungshilfeVorabcheck(await context.newPage());
    await vorabcheck2.goto();
    await vorabcheck.clickNext();
    await vorabcheck.fillRadioPage("rechtsschutzversicherung", "no");
    await expect(
      vorabcheck.page
        .getByRole("heading")
        .filter({ hasText: "Gerichtsverfahren" }),
    ).toHaveCount(1);
  });

  test("N+1 form tabs return 403", async ({ context }) => {
    for (let idx = 0; idx < csrfCountMax; idx++) {
      const newPage = new BeratungshilfeVorabcheck(await context.newPage());
      await newPage.goto();
    }

    // workaround for preview tests, it should open a new page after open the limits of tabs above
    await new BeratungshilfeVorabcheck(await context.newPage()).goto();

    await vorabcheck.clickNext();
    await expect(vorabcheck.page.getByText("403")).toHaveCount(1);
  });

  test("N+1 non-form tabs still work", async ({ context }) => {
    for (let idx = 0; idx < csrfCountMax; idx++) {
      await (await context.newPage()).goto("/");
    }
    await vorabcheck.clickNext();
    await vorabcheck.fillRadioPage("rechtsschutzversicherung", "no");
    await expect(
      vorabcheck.page
        .getByRole("heading")
        .filter({ hasText: "Gerichtsverfahren" }),
    ).toHaveCount(1);
  });
});
