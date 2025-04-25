import fs from "node:fs";
import path from "node:path";
import { type Page, type Response, expect, test } from "@playwright/test";
import { BeratungshilfeFormular } from "tests/e2e/domains/beratungshilfe/formular/BeratungshilfeFormular";
import { CookieSettings } from "tests/e2e/domains/shared/CookieSettings";
import { startFinanzielleAngabenPartner } from "tests/e2e/domains/shared/finanzielleAngaben/finanzielleAngabenPartner";
import { expectPageToBeAccessible } from "tests/e2e/util/expectPageToBeAccessible";
import { config } from "~/services/env/env.server";
import { isFeatureFlagEnabled } from "~/services/featureFlags";
import { startAnwaltlicheVertretung } from "./anwaltlicheVertretung";
import { startFinanzielleAngabenEinkommen } from "./finanzielleAngabenEinkommen";
import { startFinanzielleAngabenGrundsicherung } from "./finanzielleAngabenGrundsicherung";
import { startGrundvoraussetzungen } from "./grundvoraussetzungen";
import { startPersoenlicheDaten } from "./persoenlicheDaten";
import { startRechtsproblem } from "./rechtsproblem";
import { startFinanzielleAngabenKinder } from "../../shared/finanzielleAngaben/finanzielleAngabenKinder";

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
  await showZusammenfassung(page);

  const ausdruckenAbgabe = "ausdrucken";

  if (ausdruckenAbgabe) {
    await startAusdruckenAbgabe(page);
  } else {
    await startOnlineAbgabe(page);
    if (await isFeatureFlagEnabled("showFileUpload")) {
      await startDocumentUpload(page, beratungshilfeFormular);
    }
    await downloadOnlineAbgabe(page);
  }
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

async function startDocumentUpload(
  page: Page,
  formular: BeratungshilfeFormular,
) {
  // beratungshilfe/antrag/abgabe/dokumente
  await expectPageToBeAccessible({ page });
  await formular.clickNext();

  // Test empty form submission
  const errorMessage = page.getByTestId("inputError");
  await expect(errorMessage).toBeVisible();

  // Test file upload with a file that's too large
  const dummyFilePathTooBig = path.resolve(
    path.join(process.cwd(), "playwright/generated/", "tooBig.pdf"),
  );
  fs.writeFileSync(dummyFilePathTooBig, Buffer.alloc(1024 * 1024 * 11));
  await page.getByTestId("fileUploadInput").setInputFiles(dummyFilePathTooBig);
  const fileUploadInfo = page.getByTestId(
    "file-upload-info-grundsicherungBeweis[0]",
  );
  await expect(fileUploadInfo).toBeVisible();
  await expect(errorMessage).toBeVisible();

  await page.getByRole("button", { name: "Löschen" }).click();

  // Test file upload with a file that's of the wrong type
  const dummyFilePathWrongType = path.resolve(
    path.join(process.cwd(), "playwright/generated/", "wrongType.txt"),
  );
  fs.writeFileSync(dummyFilePathWrongType, "test");
  await page
    .getByTestId("fileUploadInput")
    .setInputFiles(dummyFilePathWrongType);
  await page
    .getByTestId("fileUploadInput")
    .setInputFiles(dummyFilePathWrongType);
  await expect(fileUploadInfo).toBeVisible();
  await expect(errorMessage).toBeVisible();

  await page.getByRole("button", { name: "Löschen" }).click();

  // Test file upload with a valid file
  const dummyFilePath = path.resolve(
    path.join(process.cwd(), "playwright/generated/", "test.pdf"),
  );
  fs.writeFileSync(dummyFilePath, Buffer.alloc(1024 * 1024 * 1));
  await page.getByTestId("fileUploadInput").setInputFiles(dummyFilePath);
  await expect(fileUploadInfo).toBeVisible();
  await expect(errorMessage).not.toBeVisible();
  await page.getByRole("button", { name: "Weiter" }).click();
  // eslint-disable-next-line sonarjs/deprecation
  await page.waitForNavigation();
}

async function startAusdruckenAbgabe(page: Page) {
  // beratungshilfe/antrag/abgabe/art
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
  expect(await newTabResponse?.headerValue("content-type")).toBe(
    "application/pdf",
  );
}
async function startOnlineAbgabe(page: Page) {
  // beratungshilfe/antrag/abgabe/art
  await beratungshilfeFormular.fillRadioPage("abgabeArt", "online");
  // beratungshilfe/antrag/abgabe/online
  await expectPageToBeAccessible({ page });
}

async function downloadOnlineAbgabe(page: Page) {
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
  expect(await newTabResponse?.headerValue("content-type")).toBe(
    "application/pdf",
  );
}

async function showZusammenfassung(page: Page) {
  if (config().ENVIRONMENT !== "production") {
    await page.goto("beratungshilfe/antrag/abgabe/art");
  }
}
