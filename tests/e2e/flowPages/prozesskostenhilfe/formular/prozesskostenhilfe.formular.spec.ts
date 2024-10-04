import { faker } from "@faker-js/faker";
import { expect, test } from "@playwright/test";
import { startFinanzielleAngabenEinkuenfte } from "tests/e2e/flowPages/prozesskostenhilfe/formular/finanzielleAngabenEinkuenfte";
import { startFinanzielleAngabenEinkuenftePartner } from "tests/e2e/flowPages/prozesskostenhilfe/formular/finanzielleAngabenEinkuenftePartner";
import { startGrundvoraussetzungen } from "tests/e2e/flowPages/prozesskostenhilfe/formular/grundvoraussetzungen";
import { CookieSettings } from "tests/e2e/pom/CookieSettings";
import { ProzesskostenhilfeFormular } from "tests/e2e/pom/ProzesskostenhilfeFormular";
import { expectPageToBeAccessible } from "tests/e2e/util/expectPageToBeAccessible";
import { startFinanzielleAngabenAusgaben } from "./finanzielleAngabenAusgaben";
import { startFinanzielleAngabenEigentum } from "./finanzielleAngabenEigentum";
import { startPersoenlicheDaten } from "./persoenlicheDaten";
import { startRechtsschutzversicherung } from "./rechtsschutzversicherung";
import { startFinanzielleAngabenAndereUnterhaltszahlungen } from "../../shared/finanzielleAngaben/finanzielleAngabenAndereUnterhaltszahlungen";
import { startFinanzielleAngabenEigentumZusammenfassung } from "../../shared/finanzielleAngaben/finanzielleAngabenEigentumZusammenfassung";
import { startFinanzielleAngabenKinder } from "../../shared/finanzielleAngaben/finanzielleAngabenKinder";
import { startFinanzielleAngabenPartner } from "../../shared/finanzielleAngaben/finanzielleAngabenPartner";

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

  // /prozesskostenhilfe/formular/grundvoraussetzungen/nachueberpruefung-frage
  await startRechtsschutzversicherung(page, prozesskostenhilfeFormular);

  // /prozesskostenhilfe/formular/finanzielle-angaben/einkommen/start
  await expectPageToBeAccessible({ page });
  await prozesskostenhilfeFormular.clickNext();

  // /prozesskostenhilfe/formular/finanzielle-angaben/einkuenfte/staatliche-leistungen
  await startFinanzielleAngabenEinkuenfte(page, prozesskostenhilfeFormular);

  // /prozesskostenhilfe/formular/finanzielle-angaben/partner/partnerschaft
  await startFinanzielleAngabenPartner(page, prozesskostenhilfeFormular);
  await startFinanzielleAngabenEinkuenftePartner(
    page,
    prozesskostenhilfeFormular,
  );
  // /prozesskostenhilfe/formular/finanzielle-angaben/partner-einkuenfte/partner-besonders-ausgaben
  await expectPageToBeAccessible({ page });
  await prozesskostenhilfeFormular.fillRadioPage(
    "partnerHasBesondersAusgaben",
    "yes",
  );

  // /prozesskostenhilfe/formular/finanzielle-angaben/partner-einkuenfte/add-partner-besonders-ausgaben
  await expectPageToBeAccessible({ page });
  await prozesskostenhilfeFormular.fillInput(
    "partnerBesondersAusgabe.beschreibung",
    faker.word.sample(),
  );
  await prozesskostenhilfeFormular.fillInput(
    "partnerBesondersAusgabe.betrag",
    faker.finance.amount(),
  );
  await prozesskostenhilfeFormular.clickNext();

  await startFinanzielleAngabenKinder(page, prozesskostenhilfeFormular);
  await startFinanzielleAngabenAndereUnterhaltszahlungen(
    page,
    prozesskostenhilfeFormular,
  );
  await startFinanzielleAngabenEigentum(page, prozesskostenhilfeFormular);
  await startFinanzielleAngabenEigentumZusammenfassung(
    page,
    prozesskostenhilfeFormular,
  );
  await prozesskostenhilfeFormular.clickNext();
  await startFinanzielleAngabenAusgaben(page, prozesskostenhilfeFormular);

  await startPersoenlicheDaten(page, prozesskostenhilfeFormular);

  // /prozesskostenhilfe/formular/abgabe/art
  // FIXME: This step is not accessible
  // await expectPageToBeAccessible({ page });
  await prozesskostenhilfeFormular.fillRadioPage("abgabeArt", "ausdrucken");

  // /prozesskostenhilfe/formular/abgabe/ausdrucken
  await expectPageToBeAccessible({ page });
});
