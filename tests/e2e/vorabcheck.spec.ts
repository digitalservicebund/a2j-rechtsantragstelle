import { test, expect } from "@playwright/test";
import { Vorabcheck } from "./pom/Vorabcheck";

let vorabcheck: Vorabcheck;

test.beforeEach(async ({ page }) => {
  vorabcheck = new Vorabcheck(page);
  await vorabcheck.goto();
});

test("forwarded to intial step", async ({ page }) => {
  await expect(page).toHaveURL(`${vorabcheck.url}/${vorabcheck.initialStep}`);
});

test("vorabcheck can be traversed", async ({ page }) => {
  await vorabcheck.fillRadioPage("hasRechtsschutzversicherung", "no");
  await vorabcheck.fillRadioPage("wurdeVerklagt", "no");
  await vorabcheck.fillRadioPage("hasKlageEingereicht", "no");
  await vorabcheck.fillRadioPage("isHamburgOderBremen", "no");
  await vorabcheck.fillRadioPage("hasBeratungshilfeBeantragt", "no");
  await vorabcheck.fillRadioPage("hasHelpedThemselves", "no");
  // warning step
  await vorabcheck.clickNext();
  await vorabcheck.fillRadioPage("hasTriedFreeServices", "no");
  // warning step
  await vorabcheck.clickNext();
  await vorabcheck.fillRadioPage("staatlicheLeistung", "keine");
  await vorabcheck.fillRadioPage("vermoegen", "below_10k");
  await vorabcheck.fillRadioPage("wantsToKnowPrecisely", "yes");
  await vorabcheck.fillRadioPage("isErwerbstaetig", "no");
  await vorabcheck.fillInputPage("einkommen", "100");
  await vorabcheck.fillRadioPage("partnerschaft", "yes");
  await vorabcheck.fillInputPage("einkommenPartner", "100");
  await vorabcheck.fillRadioPage("isPayingForKids", "no");
  await vorabcheck.fillRadioPage("isPayingUnterhalt", "no");
  await vorabcheck.fillInputPage("miete", "100");
  await vorabcheck.fillRadioPage("hasWeitereZahlungen", "no");

  await expect(
    page.getByRole("heading").filter({ hasText: "Beratungshilfe erhalten" })
  ).toHaveCount(1);
});

test("funnel: invalid context redirects to start", async ({ page }) => {
  await page.goto(`${vorabcheck.url}/eigeninitiative`);
  await expect(page).toHaveURL(`${vorabcheck.url}/${vorabcheck.initialStep}`);
});

test("funnel: invalid step redirects to start", async ({ page }) => {
  await page.goto(`${vorabcheck.url}/stepDoesNotExist`);
  await expect(page).toHaveURL(`${vorabcheck.url}/${vorabcheck.initialStep}`);
});
