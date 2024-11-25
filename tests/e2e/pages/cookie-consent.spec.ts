import { Buffer } from "buffer";
import { test, expect } from "@playwright/test";
import { acceptCookiesFieldName } from "~/components/cookieBanner/CookieBanner";
import { consentCookieName } from "~/services/analytics/gdprCookie.server";
import { CookieSettings } from "../domains/shared/CookieSettings";
import { testPageToBeAccessible } from "../util/testPageToBeAccessible";

const pageUrl = "/cookie-einstellungen";
const encode = (str: string): string =>
  Buffer.from(str, "binary").toString("base64");

test.describe(pageUrl, () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(pageUrl);
  });

  testPageToBeAccessible(pageUrl);
  test("submission button is disabled without selection", async ({ page }) => {
    await expect(
      page.getByRole("button", { name: "Speichern" }),
    ).toBeDisabled();
  });

  test("accept and decline cookies", async ({ page }) => {
    const cookieSettings = new CookieSettings(page);
    await cookieSettings.acceptCookieBanner();
    await cookieSettings.acceptCookies();

    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "gespeichert",
    );

    expect(await cookieSettings.consentCookieExists()).toBe(true);
    expect(await cookieSettings.consentCookieValue()).toBe("true");
    if (await cookieSettings.posthogEnabled())
      expect(await cookieSettings.posthogCookieExists()).toBe(true);

    await cookieSettings.goBackToSettings();
    await cookieSettings.declineCookies();

    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "gespeichert",
    );

    expect(await cookieSettings.consentCookieExists()).toBe(true);
    expect(await cookieSettings.consentCookieValue()).toBe("false");
    expect(await cookieSettings.posthogCookieExists()).toBe(false);
  });

  test("dismisses cookie banner when cookie is accepted/rejected", async ({
    page,
  }) => {
    await page.goto("/");
    const cookieSettings = new CookieSettings(page);
    await cookieSettings.acceptCookieBanner();

    await page.goto("/fluggastrechte");
    await page.goBack();
    const cookieBanner = page.getByTestId("cookie-banner");
    await expect(cookieBanner).not.toBeVisible();
  });
  test("keeps banner when cookie is not accepted/rejected", async ({
    page,
  }) => {
    await page.goto("/");
    await page.goto("/fluggastrechte");
    await page.goBack();
    const cookieBanner = page.getByTestId("cookie-banner");
    await expect(cookieBanner).toBeVisible();
  });

  test.describe("js disabled", () => {
    test.use({ javaScriptEnabled: false });

    test("submit button is enabled without selection", async ({ page }) => {
      await expect(
        page.getByRole("button", { name: "Speichern" }),
      ).not.toBeDisabled();
    });
  });
});

test.describe("/cookie-einstellungen/erfolg", () => {
  testPageToBeAccessible("/cookie-einstellungen/erfolg");
});

test.describe("Cookie Banner", () => {
  const buttonOptions = [
    {
      expectedCookie: { [acceptCookiesFieldName]: "true" },
      buttonLabel: "Akzeptieren",
    },
    {
      expectedCookie: { [acceptCookiesFieldName]: "false" },
      buttonLabel: "Ablehnen",
    },
  ];

  for (const buttonOption of buttonOptions) {
    test(`${buttonOption.buttonLabel} can be clicked`, async ({ page }) => {
      const expectedCookie = encodeURIComponent(
        encode(JSON.stringify(buttonOption.expectedCookie)),
      );
      await page.goto("/");
      await page
        .getByRole("button")
        .filter({ hasText: buttonOption.buttonLabel })
        .click();
      await expect(page.getByTestId("cookie-banner")).not.toBeVisible();
      const foundCookie = (await page.context().cookies()).find(
        (cookie) =>
          cookie.name === consentCookieName && cookie.value === expectedCookie,
      );
      expect(foundCookie).toBeDefined();
    });
  }

  test.describe("JavaScript not available in the client", () => {
    test.use({ javaScriptEnabled: false });

    for (const buttonOption of buttonOptions) {
      test(`${buttonOption.buttonLabel} can be clicked`, async ({ page }) => {
        const expectedCookie = encodeURIComponent(
          encode(JSON.stringify(buttonOption.expectedCookie)),
        );
        await page.goto("/");
        await page
          .getByRole("button")
          .filter({ hasText: buttonOption.buttonLabel })
          .click();

        await page.waitForURL(pageUrl);
        await expect(page.getByTestId("cookie-banner")).not.toBeVisible();

        const foundCookie = (await page.context().cookies()).find(
          (cookie) =>
            cookie.name === consentCookieName &&
            cookie.value === expectedCookie,
        );
        expect(foundCookie).toBeDefined();
      });
    }
  });
});
