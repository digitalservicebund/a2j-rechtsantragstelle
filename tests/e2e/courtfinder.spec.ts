import { test, expect } from "@playwright/test";
import { CourtFinder } from "./pom/CourtFinder";
import { expectPageToBeAccessible } from "./util/expectPageToBeAccessible";

let courtfinder: CourtFinder;

test.beforeEach(async ({ page }) => {
  courtfinder = new CourtFinder(page);
  await courtfinder.goto();
});

async function expectSingleCourtContent(courtfinder: CourtFinder) {
  const { page } = courtfinder;
  await expect(
    page.getByRole("heading").filter({ hasText: "Adresse" }),
  ).toHaveCount(1);
  await expect(
    page.getByRole("heading").filter({ hasText: "Telefonnummer" }),
  ).toHaveCount(1);
  await expect(
    page.getByRole("link").filter({ hasText: "Webseite" }),
  ).toHaveCount(1);
}

test.describe("accessibility", () => {
  test("search page", async () => {
    await expectPageToBeAccessible(courtfinder);
  });

  test("single result page", async () => {
    await courtfinder.searchPLZSingleResult();
    await expectPageToBeAccessible(courtfinder);
  });

  test("edge cases page", async () => {
    await courtfinder.searchPLZEdgeCases();
    await expectPageToBeAccessible(courtfinder);
  });

  test("invalid PLZ search", async () => {
    await courtfinder.searchPLZInvalid();
    await expectPageToBeAccessible(courtfinder);
  });

  test("non-existant PLZ search", async () => {
    await courtfinder.searchPLZNonExistant();
    await expectPageToBeAccessible(courtfinder);
  });
});

test.describe("form validation", () => {
  test("Invalid PLZ", async ({ page }) => {
    await courtfinder.searchPLZInvalid();
    await expect(page.getByTestId("inputError")).toBeVisible();
  });

  test("Non-existant PLZ", async ({ page }) => {
    await courtfinder.searchPLZNonExistant();
    await expect(page.getByTestId("inputError")).toBeVisible();
  });
});

test.describe("result page", () => {
  test("contains relevant content", async ({ page }) => {
    await courtfinder.searchPLZSingleResult();
    const h1 = page.locator("h1");
    await expect(h1).toContainText("zuständiges Amtsgericht");
    await expect(page.getByText(courtfinder.singleResultPLZ)).toBeVisible();
    await expectSingleCourtContent(courtfinder);
  });

  test("redirects to edge case if edge cases exist", async ({ page }) => {
    const multiResultLink = `${courtfinder.resultURL}/${courtfinder.multipleResultPLZ}`;
    await page.goto(multiResultLink);
    expect(page.url()).toContain(courtfinder.selectiontURL);
  });
});

test.describe("edge cases results", () => {
  test("heading contains PLZ", async ({ page }) => {
    await courtfinder.searchPLZEdgeCases();
    await expect(page.locator("h1")).toContainText(
      courtfinder.multipleResultPLZ,
    );
  });

  test("leads to single court", async ({ page }) => {
    await courtfinder.searchPLZEdgeCases();
    await page.getByRole("link", { name: "Berliner Ufer" }).click();
    await expectSingleCourtContent(courtfinder);
  });

  test("has working default button", async ({ page }) => {
    await courtfinder.searchPLZEdgeCases();
    await page.locator("#defaultButton").click();
    await expectSingleCourtContent(courtfinder);
  });

  test("redirects to result if no edge cases exist", async ({ page }) => {
    const multiResultLink = `${courtfinder.selectiontURL}/${courtfinder.singleResultPLZ}`;
    await page.goto(multiResultLink);
    expect(page.url()).toContain(courtfinder.resultURL);
  });
});

test.describe("back button", () => {
  test("works with searching", async ({ page, baseURL }) => {
    await courtfinder.gotoWithReferrer(baseURL);
    await courtfinder.clickBackButton();
    await page.waitForURL(courtfinder.referrer);
  });

  test("works after single result", async ({ page, baseURL }) => {
    await courtfinder.gotoWithReferrer(baseURL);
    await courtfinder.searchPLZSingleResult();
    await page.getByRole("link", { name: "Suche wiederholen" }).click();
    await courtfinder.clickBackButton();
    await page.waitForURL(courtfinder.referrer);
  });

  test("works after edge cases", async ({ page, baseURL }) => {
    await courtfinder.gotoWithReferrer(baseURL);
    await courtfinder.searchPLZEdgeCases();
    await courtfinder.clickBackButton();
    await courtfinder.clickBackButton();
    await page.waitForURL(courtfinder.referrer);
  });
});
