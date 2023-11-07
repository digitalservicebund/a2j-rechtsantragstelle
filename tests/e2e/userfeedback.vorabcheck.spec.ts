import { test, expect } from "@playwright/test";
import { BeratungshilfeVorabcheck } from "tests/e2e/pom/BeratungshilfeVorabcheck";

let vorabcheck: BeratungshilfeVorabcheck;

test.beforeEach(({ page }) => {
  vorabcheck = new BeratungshilfeVorabcheck(page);
});

test.describe("User Feedback", () => {
  test("feedback submission happy path", async ({ page }) => {
    // Given user is on the vorabchek flow
    await vorabcheck.goto();
    // and user answers
    // and user lands on the result page
    await vorabcheck.fillRadioPage("rechtsschutzversicherung", "yes");
    // then user should see rating banner
    await expect(page.getByTestId("user-feedback-banner")).toBeVisible();
    // when user clicks thumb-up icon
    await page.getByTestId("ThumbUpOutlinedIcon").click();
    // then user should see a text box and fills with text
    await page.getByRole("textbox").fill("amazing product!");
    // when user submits the feedback
    await page.getByTestId("SendOutlinedIcon").click();
    // then the user should receive info on their submission
    await expect(page.getByText("Vielen Dank!")).toBeVisible();
  });
});
