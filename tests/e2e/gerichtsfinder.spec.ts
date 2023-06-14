import { expect, test } from "@playwright/test";
import { expectPageToBeAccessible } from "./util/expectPageToBeAccessible";

const featureUrl = `/beratungshilfe/zustaendiges-gericht`;
const searchUrl = `${featureUrl}/suche`;
const resultUrl = `${featureUrl}/ergebnis`;
const selectionUrl = `${featureUrl}/auswahl`;
const submitButtonSelector = "button#submitButton";
const postcodeSingleResult = "80333";
const postcodeMultipleResults = "22145";

test.describe(searchUrl, () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(searchUrl);
  });

  test("search page is accessible", async ({ page }) => {
    await expectPageToBeAccessible({ page });
  });

  test("finds a single result", async ({ page }) => {
    await page.getByRole("textbox").fill(postcodeSingleResult);
    await page.locator(submitButtonSelector).click();
    await page.waitForURL(`${resultUrl}/${postcodeSingleResult}`);
    await expectPageToBeAccessible({ page });
  });

  test("finds edgecases", async ({ page }) => {
    await page.getByRole("textbox").fill(postcodeMultipleResults);
    await page.locator(submitButtonSelector).click();
    await page.waitForURL(`${selectionUrl}/${postcodeMultipleResults}`);
    await expectPageToBeAccessible({ page });
  });
});

test.describe(resultUrl, () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${resultUrl}/${postcodeSingleResult}`);
  });

  test("result page is accessible", async ({ page }) => {
    await expectPageToBeAccessible({ page });
  });

  test("shows relevant results", async ({ page }) => {
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
    await page.locator("#backLink").click();
    await page.waitForURL(searchUrl);
  });
});

test.describe(selectionUrl, () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${selectionUrl}/${postcodeMultipleResults}`);
  });

  test("selection page is accessible", async ({ page }) => {
    await expectPageToBeAccessible({ page });
  });

  test("shows relevant results", async ({ page }) => {
    const resultList = page.locator("#resultList");
    expect(await resultList.getByRole("link").count()).toEqual(5);
  });

  test("has results that lead to courts", async ({ page }) => {
    const resultList = page.locator("#resultList");
    await resultList.getByRole("link").first().click();
    await page.waitForURL(`${resultUrl}/${postcodeMultipleResults}/**`);
  });

  test("has working backlink", async ({ page }) => {
    await page.locator("#backLink").click();
    await page.waitForURL(searchUrl);
  });

  test("has working default button", async ({ page }) => {
    await page.locator("#defaultButton").click();
    await page.waitForURL(`${resultUrl}/${postcodeMultipleResults}/default`);
  });
});
