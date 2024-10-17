import { test, expect } from "@playwright/test";
import { footerLinks, headerLinks } from "./urlsToCheck";
import { testPageToBeAccessible } from "../util/testPageToBeAccessible";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test.describe("homepage", () => {
  testPageToBeAccessible();

  test("BMF logo is displayed", async ({ page }) => {
    const allImages = await page.getByRole("img").all();
    expect(allImages.length).toBeGreaterThan(0);
    await expect(allImages[0]).toBeVisible();
  });

  test.describe("Header links", () => {
    test("Heeader links are visible", async ({ page }) => {
      await expect(page.getByLabel("Leichte Sprache")).toBeVisible();
      await expect(page.getByLabel("Gebärdensprache")).toBeVisible();
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
