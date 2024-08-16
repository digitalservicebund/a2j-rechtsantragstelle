import type { Page } from "@playwright/test";
import { acceptCookiesFieldName } from "~/components/CookieBanner/CookieBanner";
import { consentCookieName } from "~/services/analytics/gdprCookie.server";

const decode = (str: string): string =>
  Buffer.from(str, "base64").toString("utf8");

export class CookieSettings {
  readonly page: Page;
  readonly url = "/cookie-einstellungen";
  readonly radioLabelAccept = "Analyse-Cookies einverstanden";
  readonly radioLabelDecline = "Analyse-Cookies nicht einverstanden";
  readonly buttonAcceptCookieWithJSTestId = "accept-cookie_with_js";

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

  // Only use this function for javascript tests
  async acceptCookieBanner() {
    /**
     * wait until we have the privacy banner setup for javascript users to click on it
     * and avoid to go on the cookie setup page
     * */
    const cookieAcceptButton = await this.page.waitForSelector(
      `[data-testid='${this.buttonAcceptCookieWithJSTestId}']`,
    );
    await cookieAcceptButton.click();
  }

  async goBackToSettings() {
    // This button comes from Strapi, so we can only identify it by the href attribute
    const backButtonSettings = await this.page.waitForSelector(
      `[href='${this.url}']`,
    );

    await backButtonSettings.click();
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
