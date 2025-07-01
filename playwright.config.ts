/* eslint @typescript-eslint/no-unsafe-call: 0, @typescript-eslint/no-var-requires: 0*/
import { defineConfig, devices } from "@playwright/test";
import dotenv from "dotenv";

dotenv.config(); //Read environment vars from .env

const useDefaultBaseUrl = ["", undefined].includes(process.env.E2E_BASE_URL);
const baseURL = useDefaultBaseUrl
  ? "http://localhost:3000/"
  : process.env.E2E_BASE_URL;

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: "./tests/e2e",
  /* Maximum time one test can run for. */
  timeout: 2 * 60 * 1000,
  expect: {
    /**
     * Maximum time expect() should wait for the condition to be met.
     * For example in `await expect(locator).toHaveText();`
     */
    timeout: 2 * 1000,
  },
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: process.env.CI ? "blob" : [["html", { open: "never" }]],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    bypassCSP: true,
    /* Maximum time each action such as `click()` can take. The default of 0 (no limit) will use the global timeout on failure. */
    actionTimeout: 5 * 1000,
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL,
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: "on-first-retry",
    video: "on-first-retry",
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: "critical",
      use: { ...devices["Desktop Chrome"] },
      testMatch: ["**/critical/**.spec.ts"],
    },
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
      testIgnore: ["**/critical/**.spec.ts"],
    },
    {
      name: "mobile",
      use: { ...devices["Galaxy S8"] },
      testIgnore: ["**/critical/**.spec.ts", "**/accessibilityScans.spec.ts"],
    },
  ],

  /* Folder for test artifacts such as screenshots, videos, traces, etc. */
  // outputDir: 'test-results/',

  /* Run your local dev server before starting the tests */
  webServer:
    process.env.E2E_USE_EXISTING_SERVER === "true"
      ? []
      : [
          {
            command: "docker compose up",
            port: 6380,
            reuseExistingServer: !process.env.CI,
          },
          {
            command: "pnpm run build:app && pnpm run start",
            url: "http://localhost:3000/",
            reuseExistingServer: !process.env.CI,
          },
        ],
});
