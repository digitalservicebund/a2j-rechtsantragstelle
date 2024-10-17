import { test } from "@playwright/test";
import { footerLinks, headerLinks, pageUrls } from "./urlsToCheck";
import { expectPageToBeAccessible } from "../util/expectPageToBeAccessible";

test.describe("Accessibility checks", () => {
  [...pageUrls, ...headerLinks, ...footerLinks].forEach((url) => {
    test(url, async ({ page }) => {
      await page.goto(url);
      await expectPageToBeAccessible({ page });
    });
  });
});
