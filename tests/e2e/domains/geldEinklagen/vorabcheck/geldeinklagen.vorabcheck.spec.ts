import { test, expect } from "@playwright/test";
import { CookieSettings } from "tests/e2e/domains/shared/CookieSettings";
import { GeldEinklagenVorabcheck } from "tests/e2e/domains/geldEinklagen/vorabcheck/GeldEinklagenVorabcheck";
import { expectPageToBeAccessible } from "tests/e2e/util/expectPageToBeAccessible";

let geldEinklagen: GeldEinklagenVorabcheck;

test.beforeEach(async ({ page }) => {
  geldEinklagen = new GeldEinklagenVorabcheck(page);
  await geldEinklagen.goto();

  const cookieSettings = new CookieSettings(page);
  await cookieSettings.acceptCookieBanner();
});

test("forwarded to initial step", async ({ page }) => {
  await expect(page).toHaveURL(
    new RegExp(`.+${geldEinklagen.url}/${geldEinklagen.initialStep}$`),
  );
});

test("geldeinklagen can be traversed", async ({ page }) => {
  await expectPageToBeAccessible({ page });
  await geldEinklagen.clickNext();

  await geldEinklagen.fillRadioPage("forderung", "money");
  await geldEinklagen.fillDropdownPage("geldspanne", "above_1000");

  // gerichtskostenvorschuss
  await expectPageToBeAccessible({ page });
  await geldEinklagen.clickNext();

  await geldEinklagen.fillRadioPage("bereich", "travel");

  await geldEinklagen.fillRadioPage("flug", "no");

  await geldEinklagen.fillRadioPage("privatperson", "yes");

  await geldEinklagen.fillRadioPage("gegenseite", "unternehmen");

  await geldEinklagen.fillRadioPage("gegenseiteUnternehmenDeutschland", "yes");

  await geldEinklagen.fillInputPage("gegenseiteUnternehmenPlz", "84104"); // not a partner court

  await geldEinklagen.fillInputPage("ortLeistungPlz", "85435"); // partner court

  await geldEinklagen.fillRadioPage("gegenseiteKontakt", "yes");

  await geldEinklagen.fillRadioPage("gegenseiteFrist", "yes");

  await geldEinklagen.fillRadioPage("digitalAusweisen", "yesWithId");

  await expect(
    page.getByRole("heading").filter({
      hasText: "Ein Pilotgericht ist wahrscheinlich für Ihren Fall zuständig.",
    }),
  ).toHaveCount(1);
});

test("funnel: invalid step redirects to start", async ({ page }) => {
  await page.goto(`${geldEinklagen.url}/stepDoesNotExist`);
  await expect(page).toHaveURL(
    new RegExp(`.+${geldEinklagen.url}/${geldEinklagen.initialStep}$`),
  );
});
