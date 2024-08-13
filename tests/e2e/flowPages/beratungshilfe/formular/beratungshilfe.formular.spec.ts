import { type Page, type Response, expect, test } from "@playwright/test";
import { BeratungshilfeFormular } from "tests/e2e/pom/BeratungshilfeFormular";
import { CookieSettings } from "tests/e2e/pom/CookieSettings";
import { expectPageToBeAccessible } from "tests/e2e/util/expectPageToBeAccessible";
import { startAnwaltlicheVertretung } from "./anwaltlicheVertretung";
import { startFinanzielleAngabenAusgaben } from "./finanzielleAngabenAusgaben";
import { startFinanzielleAngabenEinkommen } from "./finanzielleAngabenEinkommen";
import { startFinanzielleAngabenWohnung } from "./finanzielleAngabenWohnung";
import { startGrundvoraussetzungen } from "./grundvoraussetzungen";
import { startPersoenlicheDaten } from "./persoenlicheDaten";
import { startRechtsproblem } from "./rechtsproblem";
import { startFinanzielleAngabenAndereUnterhaltszahlungen } from "../../shared/finanzielleAngaben/finanzielleAngabenAndereUnterhaltszahlungen";
import { startFinanzielleAngabenEigentum } from "../../shared/finanzielleAngaben/finanzielleAngabenEigentum";
import { startFinanzielleAngabenEigentumZusammenfassung } from "../../shared/finanzielleAngaben/finanzielleAngabenEigentumZusammenfassung";
import { startFinanzielleAngabenKinder } from "../../shared/finanzielleAngaben/finanzielleAngabenKinder";
import { startFinanzielleAngabenPartner } from "../../shared/finanzielleAngaben/finanzielleAngabenPartner";

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

  // Observe context for requests to /download/pdf
  let newTabResponse: Response | undefined;
  page.context().on("request", async (request) => {
    const response = await request.response();
    if (request.url().endsWith("/download/pdf") && response !== null) {
      newTabResponse = response;
    }
  });

  const popupPromise = page.waitForEvent("popup");
  await page.getByRole("link").getByText("pdf").click();
  await popupPromise;

  expect(newTabResponse).not.toBeUndefined();
  expect(newTabResponse?.status()).toBe(200);
  expect(await newTabResponse?.headerValue("content-type")).toBe(
    "application/pdf",
  );
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
