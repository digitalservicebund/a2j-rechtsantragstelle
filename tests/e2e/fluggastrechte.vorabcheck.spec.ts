import { test, expect } from "@playwright/test";
import { expectPageToBeAccessible } from "./util/expectPageToBeAccessible";
import { FluggastrechteVorabcheck } from "./pom/FluggastrechteVorabcheck";

let vorabcheck: FluggastrechteVorabcheck;

test.beforeEach(async ({ page }) => {
  vorabcheck = new FluggastrechteVorabcheck(page);
  await vorabcheck.goto();
});

test("forwarded to intial step", async ({ page }) => {
  await expect(page).toHaveURL(
    new RegExp(`.+${vorabcheck.url}/${vorabcheck.initialStep}$`),
  );
});

test.skip("fluggastrechte vorabcheck can be traversed", async ({ page }) => {
  await expectPageToBeAccessible({ page });
  await vorabcheck.clickNext();

  await expectPageToBeAccessible({ page });
  await page.locator(`input[id=input-startAirport]`).fill("Berlin");
  await page.getByText("Berlin Brandenburg Flughafen (BER)").click();

  await page.locator(`input[id=input-endAirport]`).fill("Frankfurt");
  await page.getByText("Frankfurt Metropolitan Area Flughafen (FRA)").click();

  await vorabcheck.clickNext();
  /* await vorabcheck.fillMultipleInputPage([
    { field: "input-startAirport", value: "BER" },
    { field: "endAirport", value: "FRA" },
  ]);
 */
  await expectPageToBeAccessible({ page });
  await vorabcheck.fillDropdownPage("fluggesellschaft", "lufthansa");

  await expectPageToBeAccessible({ page });
  await vorabcheck.fillRadioPage("bereich", "verspaetet");

  await expectPageToBeAccessible({ page });
  await vorabcheck.fillRadioPage("verspaetung", "yes");

  await expectPageToBeAccessible({ page });
  await vorabcheck.fillRadioPage("checkin", "yes");

  await expectPageToBeAccessible({ page });
  await vorabcheck.fillRadioPage("gruende", "no");

  await expectPageToBeAccessible({ page });
  await vorabcheck.fillRadioPage("entschaedigung", "yes");

  await expectPageToBeAccessible({ page });
  await vorabcheck.fillRadioPage("gericht", "no");

  await expectPageToBeAccessible({ page });
  await vorabcheck.fillRadioPage("abtretung", "no");

  await expectPageToBeAccessible({ page });
  await vorabcheck.fillRadioPage("kostenlos", "no");

  await expectPageToBeAccessible({ page });
  await vorabcheck.fillRadioPage("rabatt", "no");

  await expectPageToBeAccessible({ page });
  await vorabcheck.fillRadioPage("buchung", "yes");

  await expectPageToBeAccessible({ page });
  await expect(page).toHaveURL(
    new RegExp(`.+${vorabcheck.url}/ergebnis/erfolg$`),
  );
});

test("funnel: invalid step redirects to start", async ({ page }) => {
  await page.goto(`${vorabcheck.url}/stepDoesNotExist`);
  await expect(page).toHaveURL(
    new RegExp(`.+${vorabcheck.url}/${vorabcheck.initialStep}$`),
  );
});

test("funnel: disabled step redirects to start", async ({ page }) => {
  await page.goto(`${vorabcheck.url}/buchung`);
  await expect(page).toHaveURL(
    new RegExp(`.+${vorabcheck.url}/${vorabcheck.initialStep}$`),
  );
});
