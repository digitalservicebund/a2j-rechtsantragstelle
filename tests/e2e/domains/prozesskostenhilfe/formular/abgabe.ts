import fs from "node:fs";
import path from "node:path";
import type { Page, Response } from "@playwright/test";
import { expect } from "@playwright/test";
import { PDFDocument } from "pdf-lib";
import { expectPageToBeAccessible } from "tests/e2e/util/expectPageToBeAccessible";
import { isFeatureFlagEnabled } from "~/services/featureFlags";

export async function startAbgabe(page: Page) {
  // prozesskostenhilfe/abgabe/dokumente

  if (await isFeatureFlagEnabled("showFileUpload")) {
    await expectPageToBeAccessible({ page });
    await page.getByRole("button", { name: "Weiter" }).click();

    // Test empty form submission
    const errorMessage = page.getByTestId("inputError");
    await expect(errorMessage).toBeVisible();

    // Test file upload with a file that's too large
    const dummyFilePathTooBig = path.resolve(
      path.join(process.cwd(), "playwright/generated/", "tooBig.pdf"),
    );
    fs.writeFileSync(dummyFilePathTooBig, Buffer.alloc(1024 * 1024 * 11));
    await page
      .getByTestId("file-upload-input-grundsicherungSozialhilfeBeweis[0]")
      .setInputFiles(dummyFilePathTooBig);
    const fileUploadInfo = page.getByTestId(
      "file-upload-info-grundsicherungSozialhilfeBeweis[0]",
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
      .getByTestId("file-upload-input-grundsicherungSozialhilfeBeweis[0]")
      .setInputFiles(dummyFilePathWrongType);
    await expect(fileUploadInfo).toBeVisible();
    await expect(errorMessage).toBeVisible();

    await page.getByRole("button", { name: "Löschen" }).click();

    // Test file upload with a valid file
    const dummyFilePath = path.resolve(
      path.join(process.cwd(), "playwright/generated/", "test.pdf"),
    );

    const pdfDoc = await PDFDocument.create();
    const pdfPage = pdfDoc.addPage([600, 800]);
    pdfPage.drawText("Test PDF", {
      x: 50,
      y: 700,
      size: 30,
    });

    const pdfBytes = await pdfDoc.save();
    fs.writeFileSync(dummyFilePath, pdfBytes);
    await page
      .getByTestId("file-upload-input-grundsicherungSozialhilfeBeweis[0]")
      .setInputFiles(dummyFilePath);
    await expect(fileUploadInfo).toBeVisible();
    await expect(errorMessage).not.toBeVisible();
    await page.getByRole("button", { name: "Weiter" }).click();
  }

  // prozesskostenhilfe/antrag/abgabe/ende
  // Observe context for requests to /download/pdf
  let newTabResponse: Response | undefined;
  page.context().on("request", async (request) => {
    const response = await request.response();
    if (request.url().endsWith("/download/pdf") && response !== null) {
      newTabResponse = response;
    }
  });

  const popupPromise = page.waitForEvent("popup", {
    timeout: 10 * 1000,
  });
  await page.getByRole("link").getByText("pdf").click();
  await popupPromise;

  expect(newTabResponse).not.toBeUndefined();
  expect(newTabResponse?.status()).toBe(200);
  expect(await newTabResponse?.headerValue("content-type")).toBe(
    "application/pdf",
  );
}
