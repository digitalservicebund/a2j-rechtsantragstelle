import type { Page } from "@playwright/test";
import { test, expect } from "@playwright/test";
import { initialStepID } from "~/lib/vorabcheck";
import { Vorabcheck } from "./pom/Vorabcheck";

let vorabcheck: Vorabcheck;

test.beforeEach(async ({ page }) => {
  vorabcheck = new Vorabcheck(page);
  await vorabcheck.goto();
});

test("forwarded to intial step", async ({ page }) => {
  await expect(page).toHaveURL(`${vorabcheck.url}/${initialStepID}`);
});

test("vorabcheck can be traversed", async ({ page }) => {
  for (let i = 5; i--; ) {
    // 5 yes/no questions
    await vorabcheck.expectHeading();
    await vorabcheck.select("No");
    await vorabcheck.clickNext();
  }

  for (let i = 2; i--; ) {
    // 2 yes/no questions with following warnings
    await vorabcheck.expectHeading();
    await vorabcheck.select("No");
    await vorabcheck.clickNext();

    // await vorabcheck.expectHeading(); // TODO: kostenfreieBeratungWarning has no heading
    await vorabcheck.clickNext();
  }

  await vorabcheck.expectHeading();
  await vorabcheck.select("Keine");
  await vorabcheck.clickNext();

  // await vorabcheck.expectHeading(); // TODO: einkommen has no heading
  await vorabcheck.select("Unter 10000");
  await vorabcheck.clickNext();

  for (let i = 4; i--; ) {
    // await vorabcheck.expectHeading(); // TODO: erwerbstaetigkeit, familienstand, kinder, unterhalt has no heading
    await vorabcheck.select("No");
    await vorabcheck.clickNext();
  }
  await page.getByLabel("Netto-Einkommen").fill("100");
  await vorabcheck.clickNext();

  await expect(page.getByRole("heading")).toContainText("Glückwunsch");
});
