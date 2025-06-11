import { test, expect, type Page } from "@playwright/test";
import { CookieSettings } from "tests/e2e/domains/shared/CookieSettings";

const POST_SUBMISSION_BOX = "user-feedback-submission";
const TOP_BREADCRUMB_ICON = "HomeOutlinedIcon";
const USER_FEEDBACK_BANNER = "user-feedback-banner";
const BERATUNGSHILFE_PAGE = "/beratungshilfe";

type FeedbackOptions = {
  page: Page;
  feedbackIconTestId: "ThumbUpOutlinedIcon" | "ThumbDownOutlinedIcon";
  message: string;
};

async function submitFeedback({
  page,
  feedbackIconTestId,
  message,
}: FeedbackOptions) {
  await page.getByTestId(feedbackIconTestId).click();
  await page.getByRole("textbox").fill(message);
  await page.getByRole("button").click();

  await expect(page.getByTestId(TOP_BREADCRUMB_ICON)).not.toBeInViewport();
  await expect(page.getByTestId(USER_FEEDBACK_BANNER)).toBeInViewport();
  await expect(page.getByTestId(POST_SUBMISSION_BOX)).toBeInViewport();
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
      feedbackIconTestId: "ThumbUpOutlinedIcon",
      message: "### e2e test submission positive",
    });
  });

  test("negative feedback submission", async ({ page }) => {
    await submitFeedback({
      page,
      feedbackIconTestId: "ThumbDownOutlinedIcon",
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
      feedbackIconTestId: "ThumbUpOutlinedIcon",
      message: "### e2e test submission positive",
    });
  });

  test("negative feedback submission", async ({ page }) => {
    await submitFeedback({
      page,
      feedbackIconTestId: "ThumbDownOutlinedIcon",
      message: "### e2e test submission negative",
    });
  });
});
