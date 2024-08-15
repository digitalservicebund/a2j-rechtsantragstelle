import { test } from "@playwright/test";
import { testPageToBeAccessible } from "../util/testPageToBeAccessible";

test.beforeEach(async ({ page }) => {
  await page.goto("/datenschutz");
});

test.describe("/datenschutz", () => {
  testPageToBeAccessible();
});
