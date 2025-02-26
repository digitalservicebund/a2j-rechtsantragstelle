import { test, expect } from "@playwright/test";
import { footerLinks, headerLinks } from "../pages/urlsToCheck";
import { testPageToBeAccessible } from "../util/testPageToBeAccessible";

const LOGO_DIV_ID = "#BMJ-Logo-Banner";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test.describe("homepage", () => {
  testPageToBeAccessible();

  test("BMJ logo is displayed", async ({ page }) => {
    // check if logo is displayed either as img role or img html tag
    const logoExist = await Promise.any([
      page
        .locator(LOGO_DIV_ID)
        .locator("div")
        .locator("img")
        .waitFor()
        .then(() => true),
      page
        .locator(LOGO_DIV_ID)
        .locator("div")
        .getByRole("img")
        .waitFor()
        .then(() => true),
    ]).catch(() => {
      // eslint-disable-next-line no-console
      console.log("Logo not found");
    });

    expect(logoExist).toBeTruthy();
  });

  test.describe("Header links", () => {
    test.skip("Header links are visible", async ({ page }) => {
      await expect(page.getByText("Leichte Sprache")).toBeVisible();
      await expect(page.getByText("Gebärden&shy;sprache")).toBeVisible();
    });

    test("Header links have correct href", async ({ page }) => {
      const headerLocator = page.locator("header");
      const headerLinkElements = await headerLocator.getByRole("link").all();
      const headerHrefs = await Promise.all(
        headerLinkElements.map((link) => link.getAttribute("href")),
      );

      headerLinks.forEach((url) => expect(headerHrefs).toContain(url));
    });
  });

  test("Footer links haf correct href", async ({ page }) => {
    const footerLocator = page.locator("footer");
    const footerLinkElements = await footerLocator.getByRole("link").all();
    const footerHrefs = await Promise.all(
      footerLinkElements.map((link) => link.getAttribute("href")),
    );

    footerLinks.forEach((url) => expect(footerHrefs).toContain(url));
  });
});
