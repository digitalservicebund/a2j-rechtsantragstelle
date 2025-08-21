import { test, expect } from "@playwright/test";
import { GeldEinklagenVorabcheck } from "tests/e2e/domains/geldEinklagen/vorabcheck/GeldEinklagenVorabcheck";
import { CookieSettings } from "tests/e2e/domains/shared/CookieSettings";
import { expectPageToBeAccessible } from "tests/e2e/util/expectPageToBeAccessible";

let geldEinklagen: GeldEinklagenVorabcheck;

test.beforeEach(async ({ page }) => {
  geldEinklagen = new GeldEinklagenVorabcheck(page);
  await geldEinklagen.goto();

  const cookieSettings = new CookieSettings(page);
  await cookieSettings.acceptCookieBanner();
});

test("forwarded to initial step", async ({ page }) => {
  await expectPageToBeAccessible({ page });
  await expect(page).toHaveURL(
    new RegExp(`.+${geldEinklagen.url}/${geldEinklagen.initialStep}$`),
  );
});
