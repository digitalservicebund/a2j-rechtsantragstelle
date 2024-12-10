import { type Page, type Response, expect, test } from "@playwright/test";
import { BeratungshilfeFormular } from "tests/e2e/domains/beratungshilfe/formular/BeratungshilfeFormular";
import { CookieSettings } from "tests/e2e/domains/shared/CookieSettings";
import { expectPageToBeAccessible } from "tests/e2e/util/expectPageToBeAccessible";
import { startAnwaltlicheVertretung } from "./anwaltlicheVertretung";
import { startFinanzielleAngabenEinkommen } from "./finanzielleAngabenEinkommen";
import { startFinanzielleAngabenGrundsicherung } from "./finanzielleAngabenGrundsicherung";
import { startGrundvoraussetzungen } from "./grundvoraussetzungen";
import { startPersoenlicheDaten } from "./persoenlicheDaten";
import { startRechtsproblem } from "./rechtsproblem";
import { startFinanzielleAngabenKinder } from "../../shared/finanzielleAngaben/finanzielleAngabenKinder";
import { startFinanzielleAngabenPartner } from "../../shared/finanzielleAngaben/finanzielleAngabenPartner";

let beratungshilfeFormular: BeratungshilfeFormular;
const TEN_SECONDS_TIMEOUT_POPUP = 10 * 1000;

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
  await startAnwaltlicheVertretung(beratungshilfeFormular);
  await startRechtsproblem(page, beratungshilfeFormular);
  await startFinanzielleAngabenGrundsicherung(beratungshilfeFormular);
  await startPersoenlicheDaten(page, beratungshilfeFormular);
  await startAbgabe(page);
});

test("invalid array index redirects to initial step of subflow", async ({
  page,
}) => {
  await expectPageToBeAccessible({ page });
  await beratungshilfeFormular.clickNext();

  await startGrundvoraussetzungen(page, beratungshilfeFormular);
  await startAnwaltlicheVertretung(beratungshilfeFormular);
  await startRechtsproblem(page, beratungshilfeFormular);
  await startFinanzielleAngabenEinkommen(beratungshilfeFormular);
  await startFinanzielleAngabenPartner(beratungshilfeFormular);
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

  // Observe context for requests to /download/pdf
  let newTabResponse: Response | undefined;
  page.context().on("request", async (request) => {
    const response = await request.response();
    if (request.url().endsWith("/download/pdf") && response !== null) {
      newTabResponse = response;
    }
  });

  const popupPromise = page.waitForEvent("popup", {
    timeout: TEN_SECONDS_TIMEOUT_POPUP,
  });
  await page.getByRole("link").getByText("pdf").click();
  await popupPromise;

  expect(newTabResponse).not.toBeUndefined();
  expect(newTabResponse?.status()).toBe(200);
}
