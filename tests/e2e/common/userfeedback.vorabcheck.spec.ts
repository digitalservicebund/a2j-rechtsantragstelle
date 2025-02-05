import { test, expect, type Page } from "@playwright/test";
import { BeratungshilfeVorabcheck } from "tests/e2e/domains/beratungshilfe/vorabcheck/BeratungshilfeVorabcheck";
import { CookieSettings } from "tests/e2e/domains/shared/CookieSettings";

let vorabcheck: BeratungshilfeVorabcheck;

const POST_SUBMISSION_BOX = "user-feedback-submission";
const TOP_BREADCRUMB_ICON = "HomeOutlinedIcon";
const USER_FEEDBACK_BANNER = "user-feedback-banner";

type SetupOptions = {
  page: Page;
  javaScriptEnabled: boolean;
};

type FeedbackOptions = {
  page: Page;
  feedbackIconTestId: "ThumbUpOutlinedIcon" | "ThumbDownOutlinedIcon";
  message: string;
};

async function setupFeedbackTests({
  page,
  javaScriptEnabled = true,
}: SetupOptions) {
  vorabcheck = new BeratungshilfeVorabcheck(page);

  await vorabcheck.goto();
  if (!javaScriptEnabled) {
    await page.getByRole("button").filter({ hasText: "Ablehnen" }).click();
    await vorabcheck.goto();
    await vorabcheck.fillRadioPageNonJavascript(
      "rechtsschutzversicherung",
      "yes",
    );
  } else {
    const cookieSettings = new CookieSettings(page);
    await cookieSettings.acceptCookieBanner();
    await vorabcheck.fillRadioPage("rechtsschutzversicherung", "yes");
  }
}

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
  const javaScriptEnabled = true;

  test.beforeEach(async ({ page }) => {
    await setupFeedbackTests({ page, javaScriptEnabled });
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
    await setupFeedbackTests({ page, javaScriptEnabled });
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
