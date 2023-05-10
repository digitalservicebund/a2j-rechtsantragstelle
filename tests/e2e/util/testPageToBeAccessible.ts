import { test } from "@playwright/test";
import { expectPageToBeAccessible } from "./expectPageToBeAccessible";

export const testPageToBeAccessible = () => {
  test("has no automatically detectable accessibility issues", async ({
    page,
  }) => {
    await expectPageToBeAccessible({ page });
  });
};
