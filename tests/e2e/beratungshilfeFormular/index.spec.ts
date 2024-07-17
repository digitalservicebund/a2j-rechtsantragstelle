import { type Page, expect, test } from "@playwright/test";
import { BeratungshilfeFormular } from "tests/e2e/pom/BeratungshilfeFormular";
import { startAnwaltlicheVertretung } from "./anwaltlicheVertretung";
import { startFinanzielleAngabenAndereUnterhaltszahlungen } from "./finanzielleAngabenAndereUnterhaltszahlungen";
import { startFinanzielleAngabenAusgaben } from "./finanzielleAngabenAusgaben";
import { startFinanzielleAngabenEigentum } from "./finanzielleAngabenEigentum";
import { startFinanzielleAngabenEigentumZusammenfassung } from "./finanzielleAngabenEigentumZusammenfassung";
import { startFinanzielleAngabenEinkommen } from "./finanzielleAngabenEinkommen";
import { startFinanzielleAngabenKinder } from "./finanzielleAngabenKinder";
import { startFinanzielleAngabenPartner } from "./finanzielleAngabenPartner";
import { startFinanzielleAngabenWohnung } from "./finanzielleAngabenWohnung";
import { startGrundvoraussetzungen } from "./grundvoraussetzungen";
import { startPersoenlicheDaten } from "./persoenlicheDaten";
import { startRechtsproblem } from "./rechtsproblem";
import { CookieSettings } from "../pom/CookieSettings";
import { expectPageToBeAccessible } from "../util/expectPageToBeAccessible";

let beratungshilfeFormular: BeratungshilfeFormular;

test.beforeEach(async ({ page }) => {
  beratungshilfeFormular = new BeratungshilfeFormular(page);
  await beratungshilfeFormular.goto();

  const cookieSettings = new CookieSettings(page);
  await cookieSettings.acceptCookieBanner();
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
  // beratungshilfe/antrag/start/start
  await expectPageToBeAccessible({ page });
  await beratungshilfeFormular.clickNext();

  await startGrundvoraussetzungen(page, beratungshilfeFormular);
  await startAnwaltlicheVertretung(page, beratungshilfeFormular);
  await startRechtsproblem(page, beratungshilfeFormular);
  await startFinanzielleAngaben(page);
  await startPersoenlicheDaten(page, beratungshilfeFormular);
  await startAbgabe(page);
  await beratungshilfeFormular.pressAntragDownloadButton();
});

test("invalid array index redirects to initial step of subflow", async ({
  page,
}) => {
  await expectPageToBeAccessible({ page });
  await beratungshilfeFormular.clickNext();

  await startGrundvoraussetzungen(page, beratungshilfeFormular);
  await startAnwaltlicheVertretung(page, beratungshilfeFormular);
  await startRechtsproblem(page, beratungshilfeFormular);
  await startFinanzielleAngabenEinkommen(page, beratungshilfeFormular);
  await startFinanzielleAngabenPartner(page, beratungshilfeFormular);
  await startFinanzielleAngabenKinder(page, beratungshilfeFormular);
  await page.goto(
    `${beratungshilfeFormular.url}/finanzielle-angaben/kinder/kinder/5/name`,
  );
  await expect(page).toHaveURL(
    new RegExp(`.+${beratungshilfeFormular.url}/start`),
  );
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
  await startFinanzielleAngabenAndereUnterhaltszahlungen(
    page,
    beratungshilfeFormular,
  );
  await startFinanzielleAngabenWohnung(page, beratungshilfeFormular);
  await beratungshilfeFormular.clickNext();
  await startFinanzielleAngabenEigentum(page, beratungshilfeFormular);
  await startFinanzielleAngabenEigentumZusammenfassung(
    page,
    beratungshilfeFormular,
  );
  await beratungshilfeFormular.clickNext();
  await startFinanzielleAngabenAusgaben(page, beratungshilfeFormular);
}
