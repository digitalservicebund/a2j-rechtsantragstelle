import { createCookie } from "@remix-run/node";
import { acceptCookiesFieldName } from "~/components/cookieBanner/CookieBanner";
import { consentCookieName, trackingCookieValue } from "../gdprCookie.server";

describe("gdprCookie", () => {
  const gdprCookie = createCookie(consentCookieName);

  const mockRequestWithCookie = (cookieValue: string) => {
    return new Request("http://localhost", {
      headers: {
        Cookie: cookieValue,
      },
    });
  };

  describe("trackingCookieValue", () => {
    it("should return 'true' when the consent is accepted", async () => {
      const gpdrCookieValue = await gdprCookie.serialize({
        [acceptCookiesFieldName]: "true",
      });

      const request = mockRequestWithCookie(gpdrCookieValue);
      const result = await trackingCookieValue({ request });

      expect(result).toEqual("true");
    });

    it("should return 'false' when the consent is rejected", async () => {
      const gpdrCookieValue = await gdprCookie.serialize({
        [acceptCookiesFieldName]: "false",
      });

      const request = mockRequestWithCookie(gpdrCookieValue);
      const result = await trackingCookieValue({ request });

      expect(result).toEqual("false");
    });

    it("should return undefined if the GDPR cookie is not present", async () => {
      const request = new Request("http://localhost");
      const result = await trackingCookieValue({ request });

      expect(result).toBeUndefined();
    });
  });
});
