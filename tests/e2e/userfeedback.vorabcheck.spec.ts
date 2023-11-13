import { test, expect } from "@playwright/test";
import { BeratungshilfeVorabcheck } from "tests/e2e/pom/BeratungshilfeVorabcheck";

let vorabcheck: BeratungshilfeVorabcheck;

const submissionBoxId = "user-feedback-submission";

test.beforeEach(async ({ page }) => {
  vorabcheck = new BeratungshilfeVorabcheck(page);
  // Move the user to the nearest page with feedback component
  await vorabcheck.goto();
  await vorabcheck.fillRadioPage("rechtsschutzversicherung", "yes");
  await expect(page.getByTestId("user-feedback-banner")).toBeVisible();
});

test.describe("User Feedback", () => {
  test("positive feedback submission", async ({ page }) => {
    // the user should see submission feedback after clicking thumb-up icon and submitting feedback
    await page.getByTestId("ThumbUpOutlinedIcon").click();
    await page.getByRole("textbox").fill("### e2e test submission positive");
    await page.getByTestId("SendOutlinedIcon").click();
    await expect(page.getByTestId(submissionBoxId)).toBeVisible();
  });

  test("negative feedback submission", async ({ page }) => {
    // the user should see submission feedback after clicking thumb-down icon and submitting feedback
    await page.getByTestId("ThumbDownOutlinedIcon").click();
    await page.getByRole("textbox").fill("### e2e test submission negative");
    await page.getByTestId("SendOutlinedIcon").click();
    await expect(page.getByTestId(submissionBoxId)).toBeVisible();
  });

  test("feedback submission abort", async ({ page }) => {
    // the user should see thank you after clicking abort feedback
    await page.getByTestId("ThumbDownOutlinedIcon").click();
    await page.getByRole("textbox").fill("### e2e test submission negative");
    await page.getByTestId("CloseOutlinedIcon").click();
    await expect(page.getByTestId(submissionBoxId)).toBeVisible();
  });
});
