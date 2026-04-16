import { test as base } from "@playwright/test";

export const test = base.extend({
  page: async ({ page }, use) => {
    await page.goto("/");
    // Ensure the CSRF/Session logic is settled before the test starts
    await page.waitForLoadState("domcontentloaded");
    await use(page); //NOSONAR
  },
});

export { expect, type Page, type Response } from "@playwright/test";
