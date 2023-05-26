import type { Page } from "@playwright/test";
import type { Page as CorePage } from "playwright-core";
import { expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

export const expectPageToBeAccessible = async ({ page }: { page: Page }) => {
  const axeConfig = { page } as { page: CorePage }; // TODO: check why type Page differs between playwright-core and @playwright/test
  const accessibilityScanResults = await new AxeBuilder(axeConfig).analyze();
  expect(accessibilityScanResults.violations).toEqual([]);
};
