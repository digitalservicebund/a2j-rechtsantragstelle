import { expect, test } from "@playwright/test";
import { startAbgabe } from "tests/e2e/flowPages/prozesskostenhilfe/formular/abgabe";
import { startAntragstellendePerson } from "tests/e2e/flowPages/prozesskostenhilfe/formular/antragstellendePerson";
import { startFinanzielleAngabenEinkuenfte } from "tests/e2e/flowPages/prozesskostenhilfe/formular/finanzielleAngabenEinkuenfte";
import { startGrundvoraussetzungen } from "tests/e2e/flowPages/prozesskostenhilfe/formular/grundvoraussetzungen";
import { CookieSettings } from "tests/e2e/pom/CookieSettings";
import { ProzesskostenhilfeFormular } from "tests/e2e/pom/ProzesskostenhilfeFormular";
import { expectPageToBeAccessible } from "tests/e2e/util/expectPageToBeAccessible";
import { startGesetzlicheVertretung } from "./gesetzlicheVertretung";
import { startPersoenlicheDaten } from "./persoenlicheDaten";

let prozesskostenhilfeFormular: ProzesskostenhilfeFormular;

test.beforeEach(async ({ page }) => {
  prozesskostenhilfeFormular = new ProzesskostenhilfeFormular(page);
  await prozesskostenhilfeFormular.goto();

  const cookieSettings = new CookieSettings(page);
  await cookieSettings.acceptCookieBanner();
});

test("funnel: invalid step redirects to start", async ({ page }) => {
  await page.goto(`${prozesskostenhilfeFormular.url}/stepDoesNotExist`);
  await expect(page).toHaveURL(
    new RegExp(
      `.+${prozesskostenhilfeFormular.url}/${prozesskostenhilfeFormular.initialStep}$`,
    ),
  );
});

test("forwarded to initial step", async ({ page }) => {
  await expect(page).toHaveURL(
    new RegExp(
      `.+${prozesskostenhilfeFormular.url}/${prozesskostenhilfeFormular.initialStep}$`,
    ),
  );
});

test("prozesskostenhilfe formular can be traversed", async ({ page }) => {
  // /prozesskostenhilfe/formular/start/start
  await expectPageToBeAccessible({ page });
  await prozesskostenhilfeFormular.clickNext();

  // /prozesskostenhilfe/formular/grundvoraussetzungen/nachueberpruefung-frage
  await startGrundvoraussetzungen(page, prozesskostenhilfeFormular);

  // /prozesskostenhilfe/formular/antragstellende-person/empfaenger
  await startAntragstellendePerson(page, prozesskostenhilfeFormular);

  // /prozesskostenhilfe/formular/finanzielle-angaben/einkuenfte/staatliche-leistungen
  await startFinanzielleAngabenEinkuenfte(page, prozesskostenhilfeFormular);

  // //prozesskostenhilfe/formular/gesetzliche-vertretung/frage
  await startGesetzlicheVertretung(page, prozesskostenhilfeFormular);

  // /prozesskostenhilfe/formular/persoenliche-daten/start
  await startPersoenlicheDaten(page, prozesskostenhilfeFormular);

  // /prozesskostenhilfe/formular/abgabe/ende
  await startAbgabe(page);
});
