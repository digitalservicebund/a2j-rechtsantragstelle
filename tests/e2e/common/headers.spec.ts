import { test } from "@playwright/test";
import { CookieSettings } from "tests/e2e/pom/CookieSettings";
import { verifyHeader } from "../util/verifyHeader";

test.describe("Cache-Control", () => {
  test("should correctly send response header", async ({ page }) => {
    await verifyHeader({
      page,
      navigate: () => page.goto("/"),
      url: "/",
      header: "cache-control",
      expectedValue: "no-store",
    });

    await verifyHeader({
      page,
      navigate: () => page.goto("/fluggastrechte"),
      url: "/fluggastrechte",
      header: "cache-control",
      expectedValue: "no-store",
    });

    const cookieSettings = new CookieSettings(page);
    await cookieSettings.acceptCookieBanner();

    await verifyHeader({
      page,
      navigate: () => page.goBack(),
      url: "/",
      header: "cache-control",
      expectedValue: null,
    });
  });
});
