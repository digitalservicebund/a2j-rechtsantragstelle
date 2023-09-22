import type { Page } from "@playwright/test";
import { consentCookieName } from "~/services/analytics/gdprCookie.server";
import { acceptCookiesFieldName } from "~/services/analytics/Analytics";

const decode = (str: string): string =>
  Buffer.from(str, "base64").toString("utf8");

export class CookieSettings {
  readonly page: Page;
  readonly url = "/cookie-einstellungen";
  readonly radioLabelAccept = "Analyse-Cookies einverstanden";
  readonly radioLabelDecline = "Analyse-Cookies nicht einverstanden";

  constructor(page: Page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto(this.url);
  }

  async posthogEnabled() {
    const posthogFrontendKey = await this.page.evaluate("ENV.POSTHOG_API_KEY");
    return posthogFrontendKey !== undefined && posthogFrontendKey !== "";
  }

  async submitForm() {
    return this.page.getByRole("button", { name: "Speichern" }).click();
  }

  async acceptCookies() {
    await this.page.getByLabel(this.radioLabelAccept).click();
    await this.submitForm();
  }

  async declineCookies() {
    await this.page.getByLabel(this.radioLabelDecline).click();
    await this.submitForm();
  }

  async goBackToSettings() {
    await this.page
      .getByRole("button", { name: "Zurück zu den Einstellungen" })
      .click();
  }

  async cookies() {
    return this.page.context().cookies();
  }

  async consentCookieExists() {
    const cookie = (await this.cookies()).find(
      (cookie) => cookie.name === consentCookieName,
    );

    return Boolean(cookie);
  }

  async consentCookieValue() {
    const stringifiedValue = (await this.cookies()).find(
      (cookie) => cookie.name === consentCookieName,
    )?.value;

    if (stringifiedValue) {
      return JSON.parse(decode(decodeURIComponent(stringifiedValue)))[
        acceptCookiesFieldName
      ];
    }

    return stringifiedValue;
  }

  async posthogCookieExists() {
    return Boolean(
      (await this.cookies()).find((cookie) => cookie.name.includes("_posthog")),
    );
  }
}
