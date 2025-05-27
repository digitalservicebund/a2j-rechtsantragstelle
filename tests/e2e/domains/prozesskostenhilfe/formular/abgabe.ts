import type { Page, Response } from "@playwright/test";
import { type Formular } from "../../shared/Formular";

export async function startAbgabe(page: Page, formular: Formular) {
  // prozesskostenhilfe/abgabe/dokumente
  await formular.clickNext();
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
