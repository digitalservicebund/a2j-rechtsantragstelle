import type { Page, Response } from "@playwright/test";
import { expect } from "@playwright/test";

export async function startAbgabe(page: Page) {
  // prozesskostenhilfe/antrag/abgabe/ende
  // FIXME: This step is not accessible
  //   await expectPageToBeAccessible({ page });

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
