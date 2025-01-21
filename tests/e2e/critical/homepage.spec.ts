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
    const logoImage = page.locator(LOGO_DIV_ID).locator("div").locator("img");
    await expect(logoImage).toBeVisible();
  });

  test.describe("Header links", () => {
    test("Header links are visible", async ({ page }) => {
      await expect(page.getByText("Leichte Sprache")).toBeVisible();
      await expect(page.getByText("Gebärdensprache")).toBeVisible();
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
