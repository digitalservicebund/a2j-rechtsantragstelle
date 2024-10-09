import { AxeBuilder } from "@axe-core/playwright";
import type { Page } from "@playwright/test";
import { expect } from "@playwright/test";

export const expectPageToBeAccessible = async ({ page }: { page: Page }) => {
  const accessibilityScanResults = await new AxeBuilder({ page })
    .setLegacyMode()
    .analyze();
  expect(
    accessibilityScanResults.violations,
    `Accessibility violations found on ${page.url()}:`,
  ).toEqual([]);
};
