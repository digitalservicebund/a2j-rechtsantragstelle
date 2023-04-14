import { test, expect } from "@playwright/test";
import { indexLinks } from "~/routes/_index";

test.beforeEach(async ({ page }) => {
  await page.goto("http://localhost:3000");
});

test("has title", async ({ page }) => {
  await expect(page).toHaveTitle("A2J - Digitale RAST");
});

test.describe("links", () => {
  indexLinks.forEach((link) => {
    test(`${link.displayName} link`, async ({ page }) => {
      const responsePromise = page.waitForResponse(
        (resp) => resp.url().includes(link.url) && resp.status() === 200,
        { timeout: 500 }
      );
      await page
        .getByRole("link", { name: link.displayName, exact: true })
        .click();
      await responsePromise;
    });
  });
});
