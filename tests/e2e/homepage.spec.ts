import { test, expect } from "@playwright/test";

test("has title", async ({ page }) => {
  await page.goto("http://localhost:3000");
  await expect(page).toHaveTitle(/New Remix App/);
});

test("kitchensink link", async ({ page }) => {
  await page.goto("http://localhost:3000");
  await page.getByRole("link", { name: "kitchensink" }).click();
  await expect(page).toHaveURL(/.*kitchensink/);
});
