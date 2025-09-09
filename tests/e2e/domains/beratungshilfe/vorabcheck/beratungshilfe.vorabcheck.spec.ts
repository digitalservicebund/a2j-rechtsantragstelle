import { test, expect } from "@playwright/test";
import { BeratungshilfeVorabcheck } from "tests/e2e/domains/beratungshilfe/vorabcheck/BeratungshilfeVorabcheck";
import { CookieSettings } from "tests/e2e/domains/shared/CookieSettings";

let vorabcheck: BeratungshilfeVorabcheck;

test.beforeEach(async ({ page }) => {
  vorabcheck = new BeratungshilfeVorabcheck(page);
  await vorabcheck.goto();

  const cookieSettings = new CookieSettings(page);
  await cookieSettings.acceptCookieBanner();
});

test("forwarded to initial step", async () => {
  await vorabcheck.assertInitialStep();
});

test("funnel: invalid step redirects to start", async ({ page }) => {
  await page.goto(`${vorabcheck.url}/stepDoesNotExist`);
  await vorabcheck.assertInitialStep();
});

test("index redirects to last known step", async ({ page }) => {
  await vorabcheck.assertInitialStep();
  await vorabcheck.clickNext();
  await vorabcheck.fillRadioPage("rechtsschutzversicherung", "no");
  await vorabcheck.fillRadioPage("wurdeVerklagt", "no");
  const intermediateUrl = vorabcheck.page.url().split("/").at(-1);
  await vorabcheck.goto();
  expect(page.url()).toContain(intermediateUrl);
});
