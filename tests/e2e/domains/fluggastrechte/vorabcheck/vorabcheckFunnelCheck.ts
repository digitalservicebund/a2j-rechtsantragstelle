import { type Page, expect } from "@playwright/test";
import type { FluggastrechteVorabcheck } from "tests/e2e/domains/fluggastrechte/vorabcheck/FluggastrechteVorabcheck";
import { CookieSettings } from "../../shared/CookieSettings";

export async function startFluggastrechteVorabcheckFunnelCheck(
  page: Page,
  vorabcheck: FluggastrechteVorabcheck,
) {
  await vorabcheck.goto();
  const cookieSettings = new CookieSettings(page);
  await cookieSettings.acceptCookieBanner();

  await page.goto(`${vorabcheck.url}/stepDoesNotExist`);
  await expect(page).toHaveURL(
    new RegExp(`.+${vorabcheck.url}/${vorabcheck.initialStep}$`),
  );

  await page.goto(`${vorabcheck.url}/buchung`);
  await expect(page).toHaveURL(
    new RegExp(`.+${vorabcheck.url}/${vorabcheck.initialStep}$`),
  );
}
