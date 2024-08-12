import { expect, test } from "@playwright/test";
import { ProzesskostenhilfeFormular } from "tests/e2e/pom/ProzesskostenhilfeFormular";
import { CookieSettings } from "../../../pom/CookieSettings";
import { startFinanzielleAngabenAndereUnterhaltszahlungen } from "../../../shared/finanzielleAngaben/finanzielleAngabenAndereUnterhaltszahlungen";
import { startFinanzielleAngabenEigentum } from "../../../shared/finanzielleAngaben/finanzielleAngabenEigentum";
import { startFinanzielleAngabenEigentumZusammenfassung } from "../../../shared/finanzielleAngaben/finanzielleAngabenEigentumZusammenfassung";
import { startFinanzielleAngabenKinder } from "../../../shared/finanzielleAngaben/finanzielleAngabenKinder";
import { startFinanzielleAngabenPartner } from "../../../shared/finanzielleAngaben/finanzielleAngabenPartner";
import { expectPageToBeAccessible } from "../../../util/expectPageToBeAccessible";

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
  // beratungshilfe/antrag/start/start
  // TODO: fix formular.server.fetchMeta to function with flow_ids
  // await expectPageToBeAccessible({ page });
  // await prozesskostenhilfeFormular.clickNext();
  // await prozesskostenhilfeFormular.clickNext();
  // await startFinanzielleAngabenPartner(page, prozesskostenhilfeFormular);
  // await startFinanzielleAngabenKinder(page, prozesskostenhilfeFormular);
  // await startFinanzielleAngabenAndereUnterhaltszahlungen(
  //   page,
  //   prozesskostenhilfeFormular,
  // );
  // await prozesskostenhilfeFormular.clickNext();
  // await startFinanzielleAngabenEigentum(page, prozesskostenhilfeFormular);
  // await startFinanzielleAngabenEigentumZusammenfassung(
  //   page,
  //   prozesskostenhilfeFormular,
  // );
});
