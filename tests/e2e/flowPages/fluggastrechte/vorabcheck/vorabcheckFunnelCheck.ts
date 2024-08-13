import { Page, expect } from "@playwright/test";
import { CookieSettings } from "../../../pom/CookieSettings";
import type { FluggastrechteVorabcheck } from "../../../pom/FluggastrechteVorabcheck";

export async function startFluggastrechteVorabcheckFunnelCheck(
  page: Page,
  vorabcheck: FluggastrechteVorabcheck,
) {
  vorabcheck.goto();
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
