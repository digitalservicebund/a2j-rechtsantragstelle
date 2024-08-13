import { test, expect } from "@playwright/test";
import { BeratungshilfeVorabcheck } from "tests/e2e/pom/BeratungshilfeVorabcheck";
import { CookieSettings } from "tests/e2e/pom/CookieSettings";
import { expectPageToBeAccessible } from "tests/e2e/util/expectPageToBeAccessible";

let vorabcheck: BeratungshilfeVorabcheck;

test.beforeEach(async ({ page }) => {
  vorabcheck = new BeratungshilfeVorabcheck(page);
  await vorabcheck.goto();

  const cookieSettings = new CookieSettings(page);
  await cookieSettings.acceptCookieBanner();
});

test("forwarded to intial step", async () => {
  await vorabcheck.assertInitialStep();
});

test("vorabcheck can be traversed (long path)", async ({ page }) => {
  await expectPageToBeAccessible({ page });
  await vorabcheck.fillRadioPage("rechtsschutzversicherung", "no");

  await expectPageToBeAccessible({ page });
  await vorabcheck.fillRadioPage("wurdeVerklagt", "no");

  await expectPageToBeAccessible({ page });
  await vorabcheck.fillRadioPage("klageEingereicht", "no");

  await expectPageToBeAccessible({ page });
  await vorabcheck.fillRadioPage("hamburgOderBremen", "no");

  await expectPageToBeAccessible({ page });
  await vorabcheck.fillRadioPage("beratungshilfeBeantragt", "no");

  await expectPageToBeAccessible({ page });
  await vorabcheck.fillRadioPage("eigeninitiative", "no");

  // warning step
  await expectPageToBeAccessible({ page });
  await vorabcheck.clickNext();

  await expectPageToBeAccessible({ page });
  await vorabcheck.fillRadioPage("bereich", "other");

  await expectPageToBeAccessible({ page });
  await vorabcheck.fillRadioPage("staatlicheLeistungen", "keine");

  await expectPageToBeAccessible({ page });
  await vorabcheck.fillRadioPage("vermoegen", "below_10k");

  await expectPageToBeAccessible({ page });
  await vorabcheck.fillRadioPage("erwerbstaetigkeit", "no");

  await expectPageToBeAccessible({ page });
  await vorabcheck.fillRadioPage("partnerschaft", "no");

  await expectPageToBeAccessible({ page });
  await vorabcheck.fillRadioPage("genauigkeit", "yes");

  await expectPageToBeAccessible({ page });
  await vorabcheck.fillInputPage("einkommen", "1550");

  await expectPageToBeAccessible({ page });
  await vorabcheck.fillRadioPage("kinder", "yes");

  await expectPageToBeAccessible({ page });
  await vorabcheck.fillInputPage("kids.kids15To18", "1");

  await expectPageToBeAccessible({ page });
  await vorabcheck.fillInputPage("einkommenKinder", "0");

  await expectPageToBeAccessible({ page });
  await vorabcheck.fillRadioPage("unterhalt", "no");

  await expectPageToBeAccessible({ page });
  await vorabcheck.fillInputPage("miete", "600");

  await expectPageToBeAccessible({ page });
  await vorabcheck.fillInputPage("weitereZahlungenSumme", "200");

  await expectPageToBeAccessible({ page });
  await expect(
    page.getByRole("heading").filter({ hasText: "Beratungshilfe erhalten" }),
  ).toHaveCount(1);
});

test("vorabcheck can be traversed (short path)", async ({ page }) => {
  await expectPageToBeAccessible({ page });
  await vorabcheck.fillRadioPage("rechtsschutzversicherung", "no");

  await expectPageToBeAccessible({ page });
  await vorabcheck.fillRadioPage("wurdeVerklagt", "no");

  await expectPageToBeAccessible({ page });
  await vorabcheck.fillRadioPage("klageEingereicht", "no");

  await expectPageToBeAccessible({ page });
  await vorabcheck.fillRadioPage("hamburgOderBremen", "no");

  await expectPageToBeAccessible({ page });
  await vorabcheck.fillRadioPage("beratungshilfeBeantragt", "no");

  await expectPageToBeAccessible({ page });
  await vorabcheck.fillRadioPage("eigeninitiative", "no");

  // warning step
  await expectPageToBeAccessible({ page });
  await vorabcheck.clickNext();

  await expectPageToBeAccessible({ page });
  await vorabcheck.fillRadioPage("bereich", "other");

  await expectPageToBeAccessible({ page });
  await vorabcheck.fillRadioPage("staatlicheLeistungen", "keine");

  await expectPageToBeAccessible({ page });
  await vorabcheck.fillRadioPage("vermoegen", "below_10k");

  await expectPageToBeAccessible({ page });
  await vorabcheck.fillRadioPage("erwerbstaetigkeit", "no");

  await expectPageToBeAccessible({ page });
  await vorabcheck.fillRadioPage("partnerschaft", "no");

  await expectPageToBeAccessible({ page });
  await vorabcheck.fillRadioPage("genauigkeit", "no");

  await expectPageToBeAccessible({ page });
  await vorabcheck.fillRadioPage("kinderKurz", "yes");

  await expectPageToBeAccessible({ page });
  await vorabcheck.fillInputPage("kinderAnzahlKurz", "5");

  await expectPageToBeAccessible({ page });
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
