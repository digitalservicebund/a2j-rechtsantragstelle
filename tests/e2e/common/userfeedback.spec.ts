import { expect, type Page } from "@playwright/test";
import { test } from "@playwright/test";
import { CookieSettings } from "tests/e2e/domains/shared/CookieSettings";
import { USER_FEEDBACK_ID } from "~/components/content/userFeedback";

const BERATUNGSHILFE_PAGE = "/beratungshilfe";

type FeedbackOptions = {
  page: Page;
  wasHelpful: "yes" | "no";
  message: string;
};

async function submitFeedback({ page, wasHelpful, message }: FeedbackOptions) {
  await page.locator(`button[value="${wasHelpful}"]`).click();
  await page.getByRole("textbox").fill(message);
  await page.getByRole("button").click({ force: true });

  await expect(page.getByTitle("Startseite")).not.toBeInViewport();
  await expect(page.getByTestId(USER_FEEDBACK_ID)).toBeInViewport();
  await expect(page.getByTestId("user-feedback-submission")).toBeInViewport();
}

test.describe("User Feedback with JavaScript", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BERATUNGSHILFE_PAGE);
    const cookieSettings = new CookieSettings(page);
    await cookieSettings.acceptCookieBanner();
  });

  test("positive feedback submission", async ({ page }) => {
    await submitFeedback({
      page,
      wasHelpful: "yes",
      message: "### e2e test submission positive",
    });
  });

  test("negative feedback submission", async ({ page }) => {
    await submitFeedback({
      page,
      wasHelpful: "no",
      message: "### e2e test submission negative",
    });
  });
});

test.describe("User Feedback without JavaScript", () => {
  const javaScriptEnabled = false;

  test.use({ javaScriptEnabled });
  test.beforeEach(async ({ page }) => {
    await page.goto(BERATUNGSHILFE_PAGE);
    await page.getByRole("button").filter({ hasText: "Ablehnen" }).click();
    await page.goto(BERATUNGSHILFE_PAGE);
  });

  test("positive feedback submission", async ({ page }) => {
    await submitFeedback({
      page,
      wasHelpful: "yes",
      message: "### e2e test submission positive",
    });
  });

  test("negative feedback submission", async ({ page }) => {
    await submitFeedback({
      page,
      wasHelpful: "no",
      message: "### e2e test submission negative",
    });
  });
});
