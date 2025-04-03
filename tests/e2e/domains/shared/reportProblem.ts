import { type Page, expect } from "@playwright/test";
import { expectPageToBeAccessible } from "tests/e2e/util/expectPageToBeAccessible";

export async function testReportProblemButton(page: Page) {
  await expect(page.getByText("Problem melden")).toBeVisible();
  await page.locator("text=Problem melden").click();
  await expectPageToBeAccessible({ page });
  const submitButton = page.getByText("Problem absenden");
  await expect(submitButton).toBeDisabled();
  expect(await page.getByRole("checkbox").all()).toHaveLength(4);
  const openQuestionTextarea = page.getByRole("textbox");
  await expect(openQuestionTextarea).toBeVisible();
  await page.getByRole("checkbox").first().click();
  await expect(page.getByRole("checkbox").first()).toBeChecked();
  await expect(submitButton).toBeEnabled();
  await openQuestionTextarea.fill("Test value");
  await expect(openQuestionTextarea).toHaveValue("Test value");
  await page.getByRole("button", { name: "Abbrechen" }).click();
  await expect(openQuestionTextarea).not.toBeVisible();
}
