import { test, expect } from "@playwright/test";
import { Vorabcheck } from "./pom/Vorabcheck";
import { expectPageToBeAccessible } from "./util/expectPageToBeAccessible";

let vorabcheck: Vorabcheck;

test.beforeEach(async ({ page }) => {
  vorabcheck = new Vorabcheck(page);
  await vorabcheck.goto();
});

test("forwarded to intial step", async ({ page }) => {
  await expect(page).toHaveURL(`${vorabcheck.url}/${vorabcheck.initialStep}`);
});

test("vorabcheck can be traversed", async ({ page }) => {
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
  await vorabcheck.fillInputPage("kids15To18", "1");

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
    page.getByRole("heading").filter({ hasText: "Beratungshilfe erhalten" })
  ).toHaveCount(1);
});

test("funnel: invalid step redirects to start", async ({ page }) => {
  await page.goto(`${vorabcheck.url}/stepDoesNotExist`);
  await expect(page).toHaveURL(`${vorabcheck.url}/${vorabcheck.initialStep}`);
});
