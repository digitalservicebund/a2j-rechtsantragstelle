import { test } from "@playwright/test";
import { testPageToBeAccessible } from "../util/testPageToBeAccessible";

test.describe("Impressum", () => {
  testPageToBeAccessible("/impressum");

  test("forwards trailing slash with 301", async ({ page }) => {
    const redirectPromise = page.waitForResponse(
      (resp) => resp.url().includes("/impressum/") && resp.status() === 301,
    );
    const resultPromise = page.waitForResponse(
      (resp) => resp.url().includes("/impressum") && resp.status() === 200,
    );
    await page.goto("/impressum/");
    await redirectPromise;
    await resultPromise;
  });
});
