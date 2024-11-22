import { test, expect } from "@playwright/test";
import { BeratungshilfeVorabcheck } from "tests/e2e/domains/beratungshilfe/vorabcheck/BeratungshilfeVorabcheck";
import { CookieSettings } from "tests/e2e/domains/shared/CookieSettings";
import { expectPageToBeAccessible } from "tests/e2e/util/expectPageToBeAccessible";

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

test("vorabcheck can be traversed (short path)", async ({ page }) => {
  await vorabcheck.fillRadioPage("rechtsschutzversicherung", "no");

  await vorabcheck.fillRadioPage("wurdeVerklagt", "no");

  await vorabcheck.fillRadioPage("klageEingereicht", "no");

  await vorabcheck.fillRadioPage("hamburgOderBremen", "no");

  await vorabcheck.fillRadioPage("beratungshilfeBeantragt", "no");

  await vorabcheck.fillRadioPage("eigeninitiative", "no");

  // warning step
  await vorabcheck.clickNext();

  await vorabcheck.fillRadioPage("bereich", "other");

  await vorabcheck.fillRadioPage("staatlicheLeistungen", "keine");

  await vorabcheck.fillRadioPage("vermoegen", "below_10k");

  await vorabcheck.fillRadioPage("erwerbstaetigkeit", "no");

  await vorabcheck.fillRadioPage("partnerschaft", "no");

  await vorabcheck.fillRadioPage("genauigkeit", "no");

  await vorabcheck.fillRadioPage("kinderKurz", "yes");

  await vorabcheck.fillInputPage("kinderAnzahlKurz", "5");

  await vorabcheck.fillRadioPage("verfuegbaresEinkommen", "yes");

  await expectPageToBeAccessible({ page });
  await expect(
    page
      .getByRole("heading")
      .filter({ hasText: "keine Beratungshilfe erhalten" }),
  ).toHaveCount(1);
});

test("funnel: invalid step redirects to start", async ({ page }) => {
  await page.goto(`${vorabcheck.url}/stepDoesNotExist`);
  await vorabcheck.assertInitialStep();
});

test("index redirects to last known step", async ({ page }) => {
  await vorabcheck.assertInitialStep();
  await vorabcheck.fillRadioPage("rechtsschutzversicherung", "no");
  await vorabcheck.fillRadioPage("wurdeVerklagt", "no");
  const intermediateUrl = vorabcheck.page.url().split("/").at(-1);
  await vorabcheck.goto();
  expect(page.url()).toContain(intermediateUrl);
});
