import { test, expect } from "@playwright/test";
import { Homepage } from "./pom/Homepage";

test("has title", async ({ page }) => {
  const home = new Homepage(page);
  await home.goto();
  await expect(page).toHaveTitle(/New Remix App/);
});

test.describe("links", () => {
  test("kitchensink link", async ({ page }) => {
    const home = new Homepage(page);
    await home.goto();
    await home.gotoKitchensink();
    await expect(page).toHaveURL(/.*kitchensink/);
  });

  test("multi-page form link", async ({ page }) => {
    const home = new Homepage(page);
    await home.goto();
    await home.gotoMultiPageForm();
    await expect(page).toHaveURL(/.*form\/welcome/);
  });

  test("types showcase link", async ({ page }) => {
    const home = new Homepage(page);
    await home.goto();
    await home.gotoTypesShowcase();
    await expect(page).toHaveURL(/.*types_showcase/);
  });
});
