import { test, expect } from "@playwright/test";
import { CookieSettings } from "tests/e2e/pom/CookieSettings";
import { GeldEinklagenVorabcheck } from "tests/e2e/pom/GeldEinklagenVorabcheck";
import { expectPageToBeAccessible } from "tests/e2e/util/expectPageToBeAccessible";

let geldEinklagen: GeldEinklagenVorabcheck;

test.beforeEach(async ({ page }) => {
  geldEinklagen = new GeldEinklagenVorabcheck(page);
  await geldEinklagen.goto();

  const cookieSettings = new CookieSettings(page);
  await cookieSettings.acceptCookieBanner();
});

test("forwarded to intial step", async ({ page }) => {
  await expect(page).toHaveURL(
    new RegExp(`.+${geldEinklagen.url}/${geldEinklagen.initialStep}$`),
  );
});

test("geldeinklagen can be traversed", async ({ page }) => {
  await expectPageToBeAccessible({ page });
  await geldEinklagen.clickNext();

  await expectPageToBeAccessible({ page });
  await geldEinklagen.fillRadioPage("forderung", "money");

  await expectPageToBeAccessible({ page });
  await geldEinklagen.fillDropdownPage("geldspanne", "above_1000");

  // gerichtskostenvorschuss
  await expectPageToBeAccessible({ page });
  await geldEinklagen.clickNext();

  await expectPageToBeAccessible({ page });
  await geldEinklagen.fillRadioPage("bereich", "travel");

  await expectPageToBeAccessible({ page });
  await geldEinklagen.fillRadioPage("flug", "no");

  await expectPageToBeAccessible({ page });
  await geldEinklagen.fillRadioPage("privatperson", "yes");

  await expectPageToBeAccessible({ page });
  await geldEinklagen.fillRadioPage("gegenseite", "unternehmen");

  await expectPageToBeAccessible({ page });
  await geldEinklagen.fillRadioPage("gegenseiteUnternehmenDeutschland", "yes");

  await expectPageToBeAccessible({ page });
  await geldEinklagen.fillInputPage("gegenseiteUnternehmenPlz", "84104"); // not a partner court

  await expectPageToBeAccessible({ page });
  await geldEinklagen.fillInputPage("ortLeistungPlz", "85435"); // partner court

  await expectPageToBeAccessible({ page });
  await geldEinklagen.fillRadioPage("gegenseiteKontakt", "yes");

  await expectPageToBeAccessible({ page });
  await geldEinklagen.fillRadioPage("gegenseiteFrist", "yes");

  await expectPageToBeAccessible({ page });
  await geldEinklagen.fillRadioPage("digitalAusweisen", "yesWithId");

  await expectPageToBeAccessible({ page });
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
