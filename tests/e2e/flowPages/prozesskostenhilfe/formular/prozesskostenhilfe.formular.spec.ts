import { expect, test } from "@playwright/test";
import { CookieSettings } from "tests/e2e/pom/CookieSettings";
import { ProzesskostenhilfeFormular } from "tests/e2e/pom/ProzesskostenhilfeFormular";
import { expectPageToBeAccessible } from "tests/e2e/util/expectPageToBeAccessible";
import { startFinanzielleAngabenAndereUnterhaltszahlungen } from "../../shared/finanzielleAngaben/finanzielleAngabenAndereUnterhaltszahlungen";
import { startFinanzielleAngabenEigentum } from "../../shared/finanzielleAngaben/finanzielleAngabenEigentum";
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

  // /prozesskostenhilfe/formular/finanzielle-angaben/einkommen/start
  await expectPageToBeAccessible({ page });
  await prozesskostenhilfeFormular.clickNext();

  // /prozesskostenhilfe/formular/finanzielle-angaben/partner/partnerschaft
  await startFinanzielleAngabenPartner(page, prozesskostenhilfeFormular);
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

  // /prozesskostenhilfe/formular/abgabe/art
  // FIXME: This step is not accessible
  // await expectPageToBeAccessible({ page });
  await prozesskostenhilfeFormular.fillRadioPage("abgabeArt", "ausdrucken");

  // /prozesskostenhilfe/formular/abgabe/ausdrucken
  await expectPageToBeAccessible({ page });
});
