import { test } from "@playwright/test";
import { expectPageToBeAccessible } from "../util/expectPageToBeAccessible";
const urlsToCheck = [
  "/beratungshilfe",
  "/datenschutz",
  "/geld-einklagen",
  "/impressum",
  "/cookie-einstellungen",
  "/barrierefreiheit",
];

test.describe("Accessibility checks", () => {
  urlsToCheck.forEach((url) => {
    test(`${url} a11y check`, async ({ page }) => {
      await page.goto(url);
      await expectPageToBeAccessible({ page });
    });
  });
});
