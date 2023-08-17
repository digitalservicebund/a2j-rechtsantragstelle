import { Buffer } from "buffer";
import { test, expect } from "@playwright/test";
import { testPageToBeAccessible } from "./util/testPageToBeAccessible";
import { consentCookieName } from "~/services/analytics/gdprCookie.server";
import { acceptCookiesFieldName } from "~/services/analytics/Analytics";

const encode = (str: string): string =>
  Buffer.from(str, "binary").toString("base64");

test.describe("/cookie-einstellungen", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/cookie-einstellungen");
  });

  testPageToBeAccessible("/cookie-einstellungen");
  test("submission button is disabled without selection", async ({ page }) => {
    await expect(
      page.getByRole("button", { name: "Speichern" }),
    ).toBeDisabled();
  });

  const radioOptions = [
    {
      expectedCookie: { [acceptCookiesFieldName]: "true" },
      radioLabel: "Analyse-Cookies einverstanden",
    },
    {
      expectedCookie: { [acceptCookiesFieldName]: "false" },
      radioLabel: "Analyse-Cookies nicht einverstanden",
    },
  ];

  for (const radioOption of radioOptions) {
    test(`option ${radioOption.radioLabel} can be selected and submitted`, async ({
      page,
    }) => {
      const expectedCookie = encodeURIComponent(
        encode(JSON.stringify(radioOption.expectedCookie)),
      );
      await page.getByLabel(radioOption.radioLabel).click();
      await page.getByRole("button", { name: "Speichern" }).click();
      await expect(page.getByRole("heading", { level: 1 })).toContainText(
        "gespeichert",
      );
      const foundCookie = (await page.context().cookies()).find(
        (cookie) =>
          cookie.name === consentCookieName && cookie.value === expectedCookie,
      );
      expect(foundCookie).toBeDefined();
    });
  }

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

  test.describe("js disabled", () => {
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

        await page.waitForURL("/cookie-einstellungen");
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
