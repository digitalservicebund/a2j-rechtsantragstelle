import { type Page, expect, test } from "@playwright/test";
import { expectPageToBeAccessible } from "../util/expectPageToBeAccessible";
import { BeratungshilfeFormular } from "tests/e2e/pom/BeratungshilfeFormular";
import { startFinanzielleAngabenBesitz } from "./finanzielleAngabenBesitz";
import { startFinanzielleAngabenZusammenfassung } from "./finanzielleAngabenZusammenfassung";
import { startFinanzielleAngabenEinkommen } from "./finanzielleAngabenEinkommen";
import { startFinanzielleAngabenPartner } from "./finanzielleAngabenPartner";
import { startFinanzielleAngabenKinder } from "./finanzielleAngabenKinder";
import { startPersoenlicheDaten } from "./persoenlicheDaten";
import { startAnwaltlicheVertretung } from "./anwaltlicheVertretung";
import { startRechtsproblem } from "./rechtsproblem";
import { startGrundvoraussetzungen } from "./grundvoraussetzungen";

let beratungshilfeFormular: BeratungshilfeFormular;

test.beforeEach(async ({ page }) => {
  beratungshilfeFormular = new BeratungshilfeFormular(page);
  await beratungshilfeFormular.goto();
});

test("funnel: invalid step redirects to start", async ({ page }) => {
  await page.goto(`${beratungshilfeFormular.url}/stepDoesNotExist`);
  await expect(page).toHaveURL(
    new RegExp(
      `.+${beratungshilfeFormular.url}/${beratungshilfeFormular.initialStep}$`,
    ),
  );
});

test("forwarded to initial step", async ({ page }) => {
  await expect(page).toHaveURL(
    new RegExp(
      `.+${beratungshilfeFormular.url}/${beratungshilfeFormular.initialStep}$`,
    ),
  );
});

test("beratungshilfe formular can be traversed", async ({ page }) => {
  // beratunshilfe/antrag/start
  await expectPageToBeAccessible({ page });
  await beratungshilfeFormular.clickNext();

  await startGrundvoraussetzungen(page, beratungshilfeFormular);
  await startAnwaltlicheVertretung(page, beratungshilfeFormular);
  await startRechtsproblem(page, beratungshilfeFormular);
  await startFinanzielleAngaben(page);
  await startPersoenlicheDaten(page, beratungshilfeFormular);
  await startAbgabe(page);
});

async function startAbgabe(page: Page) {
  // beratungshilfe/antrag/abgabe/art
  // FIXME: This step is not accessible
  // await expectPageToBeAccessible({ page });
  await beratungshilfeFormular.fillRadioPage("abgabeArt", "ausdrucken");
  // beratungshilfe/antrag/abgabe/ausdrucken
  await expectPageToBeAccessible({ page });
  await beratungshilfeFormular.hasAntragDownloadButton();
}

async function startFinanzielleAngaben(page: Page) {
  await startFinanzielleAngabenEinkommen(page, beratungshilfeFormular);
  await startFinanzielleAngabenPartner(page, beratungshilfeFormular);
  await startFinanzielleAngabenKinder(page, beratungshilfeFormular);
  await startFinanzielleAngabenBesitz(page, beratungshilfeFormular);
  await startFinanzielleAngabenZusammenfassung(page, beratungshilfeFormular);
  await expectPageToBeAccessible({ page });
  await beratungshilfeFormular.clickNext();

  // beratungshilfe/antrag/finanzielleAngaben/danke
  await expectPageToBeAccessible({ page });
  await beratungshilfeFormular.clickNext();
}
