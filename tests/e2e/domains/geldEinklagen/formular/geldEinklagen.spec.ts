import { test } from "@playwright/test";
import { CookieSettings } from "tests/e2e/domains/shared/CookieSettings";
import { GeldEinklagenFormular } from "./GeldEinklagenFormular";
import { startGerichtPruefen } from "./gerichtPruefen";

let geldEinklagenFormular: GeldEinklagenFormular;

test.beforeEach(async ({ page }) => {
  geldEinklagenFormular = new GeldEinklagenFormular(page);
  await geldEinklagenFormular.goto();

  const cookieSettings = new CookieSettings(page);
  await cookieSettings.acceptCookieBanner();
});

test("geld einklagen formular can be traversed", async () => {
  await startGerichtPruefen(geldEinklagenFormular);
});
