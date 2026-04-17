import { test } from "@playwright/test";
import { expectPageToBeAccessible } from "./expectPageToBeAccessible";

export const testPageToBeAccessible = (url?: string) => {
  test("has no automatically detectable accessibility issues", async ({
    page,
  }) => {
    if (url) {
      await page.goto(url);
    }
    await expectPageToBeAccessible({ page });
  });
};
