import { test, expect } from "@playwright/test";
import { Amtsgericht } from "./pom/Amtsgericht";
import { expectPageToBeAccessible } from "./util/expectPageToBeAccessible";

let amtsgericht: Amtsgericht;

test.beforeEach(async ({ page }) => {
  amtsgericht = new Amtsgericht(page);
  await amtsgericht.goto();
});

test("simple search with one court", async ({ page }) => {
  // TODO: title missing
  // await expectPageToBeAccessible({ page });
  await amtsgericht.fillSearchField("13127");
  await amtsgericht.submitSearchForm();
  await expect(page.locator("h1")).toContainText(amtsgericht.resultHeading);
  await expectPageToBeAccessible({ page });
});

test("simple search with edge cases", async ({ page }) => {
  await amtsgericht.fillSearchField("20457");
  await amtsgericht.submitSearchForm();
  await expect(page.locator("h1")).toContainText(
    "Im Bereich Ihrer Postleitzahl 20457 sind verschiedene Amtsgerichte zuständig. Wohnen Sie in einer dieser Straßen?"
  );
  // TODO: title missing
  // await expectPageToBeAccessible({ page });
  await page.getByRole("link", { name: "Berliner Ufer" }).click();
  await expect(page.locator("h1")).toContainText(amtsgericht.resultHeading);
});

test("invalid search", async ({ page }) => {
  await amtsgericht.fillSearchField("1234");
  await amtsgericht.submitSearchForm();
  await expect(page.locator("form")).toContainText(
    "Postleitzahl muss genau 5 Zeichen lang sein"
  );
  // TODO: title missing
  // await expectPageToBeAccessible({ page });
});
