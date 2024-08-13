import { test, expect } from "@playwright/test";
import { CookieSettings } from "../pom/CookieSettings";
import { CourtFinder } from "../pom/CourtFinder";
import { expectPageToBeAccessible } from "../util/expectPageToBeAccessible";

let courtfinder: CourtFinder;

test.beforeEach(async ({ page }) => {
  courtfinder = new CourtFinder(page);
  await courtfinder.goto();

  const cookieSettings = new CookieSettings(page);
  await cookieSettings.acceptCookieBanner();
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
    await expect(h1).toBeVisible();
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
  // Warning - this is quite brittle due to potential username:pw in the baseURL
  // Make sure to test against staging!

  function cleanBaseUrl(baseURL?: string) {
    const url = new URL(baseURL ?? "");
    return `${url.origin}${url.pathname}`;
  }

  test("works with searching", async ({ page, baseURL }) => {
    const cleanBaseURL = cleanBaseUrl(baseURL);
    await courtfinder.gotoWithReferrer(cleanBaseURL);
    await courtfinder.clickBackButton();
    expect(page.url().endsWith(courtfinder.referrer)).toBeTruthy();
  });

  test("works after single result", async ({ page, baseURL }) => {
    const cleanBaseURL = cleanBaseUrl(baseURL);
    await courtfinder.gotoWithReferrer(cleanBaseURL);
    await courtfinder.searchPLZSingleResult();
    await page.click("#backLink");
    await courtfinder.clickBackButton();
    expect(page.url().endsWith(courtfinder.referrer)).toBeTruthy();
  });

  test("works after edge cases", async ({ page, baseURL }) => {
    const cleanBaseURL = cleanBaseUrl(baseURL);
    await courtfinder.gotoWithReferrer(cleanBaseURL);
    await courtfinder.searchPLZEdgeCases();
    await courtfinder.clickBackButton();
    await courtfinder.clickBackButton();
    expect(page.url().endsWith(courtfinder.referrer)).toBeTruthy();
  });
});
