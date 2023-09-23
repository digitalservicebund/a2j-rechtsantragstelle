import { test, expect } from "@playwright/test";
import { expectPageToBeAccessible } from "./util/expectPageToBeAccessible";
import { GeldEinklagen } from "./pom/GeldEinklagen";

let geldEinklagen: GeldEinklagen;

test.beforeEach(async ({ page }) => {
  geldEinklagen = new GeldEinklagen(page);
  await geldEinklagen.goto();
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
  await geldEinklagen.fillInputPage("gegenseiteUnternehmenPlz", "85433"); // not a partner court

  await expectPageToBeAccessible({ page });
  await geldEinklagen.fillInputPage("ortLeistungPlz", "85435"); // partner court

  await expectPageToBeAccessible({ page });
  await expect(
    page.getByRole("heading").filter({ hasText: "Super" }),
  ).toHaveCount(1);
});

test("funnel: invalid step redirects to start", async ({ page }) => {
  await page.goto(`${geldEinklagen.url}/stepDoesNotExist`);
  await expect(page).toHaveURL(
    new RegExp(`.+${geldEinklagen.url}/${geldEinklagen.initialStep}$`),
  );
});
