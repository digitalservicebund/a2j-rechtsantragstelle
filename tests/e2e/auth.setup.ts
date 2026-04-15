import { test as setup } from "@playwright/test";
import path from "node:path";

const authFile = path.join(
  process.cwd(),
  "/playwright/.auth/storageState.json",
);

setup("Set session storage and CSRF token", async ({ page }) => {
  // Visit homepage to retrieve CSRF token and session cookies.
  await page.goto("/");
  // Wait for the session to settle
  await page.waitForLoadState("networkidle");

  await page.context().storageState({ path: authFile });
});
