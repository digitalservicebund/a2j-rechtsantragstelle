import { expect, test } from "@playwright/test";
import { testPageToBeAccessible } from "./util/testPageToBeAccessible";

const featureUrl = `/amtsgericht`;
const searchUrl = `${featureUrl}/suche`;
const resultUrl = `${featureUrl}/ergebnis`;
const selectionUrl = `${featureUrl}/auswahl`;
const submitButtonSelector = "button#submitButton";
const postcodeSingleResult = "80333";
const postcodeMultipleResults = "22145";

test.describe(searchUrl, () => {
  // TODO: fix accessability
  // testPageToBeAccessible(searchUrl);

  test("finds a single result", async ({ page }) => {
    await page.goto(searchUrl);
    await page.getByRole("textbox").fill(postcodeSingleResult);
    await page.locator(submitButtonSelector).click();
    await page.waitForURL(`${resultUrl}/${postcodeSingleResult}`);
  });

  test("finds edgecases", async ({ page }) => {
    await page.goto(searchUrl);
    await page.getByRole("textbox").fill(postcodeMultipleResults);
    await page.locator(submitButtonSelector).click();
    await page.waitForURL(`${selectionUrl}/${postcodeMultipleResults}`);
  });
});

test.describe(resultUrl, () => {
  // TODO: fix accessability
  // testPageToBeAccessible(resultUrl);

  test("shows relevant results", async ({ page }) => {
    await page.goto(`${resultUrl}/${postcodeSingleResult}`);
    await expect(
      page.getByRole("heading").filter({ hasText: "Adresse" })
    ).toHaveCount(1);
    await expect(
      page.getByRole("heading").filter({ hasText: "Telefonnummer" })
    ).toHaveCount(1);
    await expect(
      page.getByRole("link").filter({ hasText: "Webseite" })
    ).toHaveCount(1);
  });

  test("has working backlink", async ({ page }) => {
    await page.goto(`${resultUrl}/${postcodeSingleResult}`);
    await page.locator("#backLink").click();
    await page.waitForURL(searchUrl);
  });
});

test.describe(selectionUrl, () => {
  // TODO: fix accessability
  // testPageToBeAccessible(selectionUrl);

  test("shows relevant results", async ({ page }) => {
    await page.goto(`${selectionUrl}/${postcodeMultipleResults}`);
    const resultList = page.locator("#resultList");
    expect(await resultList.getByRole("link").count()).toEqual(5);
  });

  test("has results that lead to courts", async ({ page }) => {
    await page.goto(`${selectionUrl}/${postcodeMultipleResults}`);
    const resultList = page.locator("#resultList");
    await resultList.getByRole("link").first().click();
    await page.waitForURL(`${resultUrl}/${postcodeMultipleResults}/**`);
  });

  test("has working backlink", async ({ page }) => {
    await page.goto(`${selectionUrl}/${postcodeMultipleResults}`);
    await page.locator("#backLink").click();
    await page.waitForURL(searchUrl);
  });

  test("has working default button", async ({ page }) => {
    await page.goto(`${selectionUrl}/${postcodeMultipleResults}`);
    await page.locator("#defaultButton").click();
    await page.waitForURL(`${resultUrl}/${postcodeMultipleResults}/default`);
  });
});
