import { test, expect } from "@playwright/test";
import { Homepage } from "./pom/Homepage";

let home: Homepage;

test.beforeEach(async ({ page }) => {
  home = new Homepage(page);
  await home.goto();
});

test("has title", async ({ page }) => {
  await expect(page).toHaveTitle("");
});

test.describe("links", () => {
  test("kitchensink link", async ({ page }) => {
    await home.gotoKitchensink();
    await expect(page).toHaveURL(/.*kitchensink/);
  });

  test("multi-page form link", async ({ page }) => {
    await home.gotoMultiPageForm();
    await expect(page).toHaveURL(/.*form\/rechtschutzversicherung/);
  });

  test("types showcase link", async ({ page }) => {
    await home.gotoTypesShowcase();
    await expect(page).toHaveURL(/.*types_showcase/);
  });
});
