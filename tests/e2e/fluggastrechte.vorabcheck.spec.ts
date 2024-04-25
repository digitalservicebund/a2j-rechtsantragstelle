import { test, expect } from "@playwright/test";
import { expectPageToBeAccessible } from "./util/expectPageToBeAccessible";
import { FluggastrechteVorabcheck } from "./pom/FluggastrechteVorabcheck";

let vorabcheck: FluggastrechteVorabcheck;

test.beforeEach(async ({ page }) => {
  vorabcheck = new FluggastrechteVorabcheck(page);
  await vorabcheck.goto();
});

test.describe("js enabled", () => {
  test("forwarded to intial step", async ({ page }) => {
    await expect(page).toHaveURL(
      new RegExp(`.+${vorabcheck.url}/${vorabcheck.initialStep}$`),
    );
  });

  test("fluggastrechte vorabcheck can be traversed and Javascript enabled", async ({
    page,
  }) => {
    await expectPageToBeAccessible({ page });
    await vorabcheck.clickNext(true);

    await expectPageToBeAccessible({ page });

    await vorabcheck.fillMultipleSuggestionInputPage([
      { field: "input-startAirport", value: "Berlin" },
      { field: "input-endAirport", value: "Frankfurt" },
    ]);

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
});

test.describe("js disabled", () => {
  test.use({ javaScriptEnabled: false });

  test("fluggastrechte vorabcheck can be traversed and Javascript disabled", async ({
    page,
  }) => {
    await page.getByRole("button").filter({ hasText: "Ablehnen" }).click();
    await vorabcheck.goto();
    await vorabcheck.clickNext(false);

    await vorabcheck.fillMultipleInputPageNonJavascript([
      { field: "startAirport", value: "BER" },
      { field: "endAirport", value: "FRA" },
    ]);

    await vorabcheck.fillDropdownPageNonJavascript(
      "fluggesellschaft",
      "lufthansa",
    );
    await vorabcheck.fillRadioPageNonJavascript("bereich", "verspaetet");
    await vorabcheck.fillRadioPageNonJavascript("verspaetung", "yes");
    await vorabcheck.fillRadioPageNonJavascript("checkin", "yes");
    await vorabcheck.fillRadioPageNonJavascript("gruende", "no");
    await vorabcheck.fillRadioPageNonJavascript("entschaedigung", "yes");
    await vorabcheck.fillRadioPageNonJavascript("gericht", "no");
    await vorabcheck.fillRadioPageNonJavascript("abtretung", "no");
    await vorabcheck.fillRadioPageNonJavascript("kostenlos", "no");
    await vorabcheck.fillRadioPageNonJavascript("rabatt", "no");
    await vorabcheck.fillRadioPageNonJavascript("buchung", "yes");

    await expect(page).toHaveURL(
      new RegExp(`.+${vorabcheck.url}/ergebnis/erfolg$`),
    );
  });
});
