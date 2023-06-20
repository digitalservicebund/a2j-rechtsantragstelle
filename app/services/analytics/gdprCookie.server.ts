import { createCookie } from "@remix-run/node";

export const acceptCookiesFieldName = "accept-cookies";
export const gdprCookie = createCookie("gdpr-consent", {
  maxAge: 365 * 24 * 60 * 60,
});

type CookieArgs = { request: Request };

async function parseTrackingCookie({
  request,
}: CookieArgs): Promise<Record<string, string | undefined>> {
  const cookieHeader = request.headers.get("Cookie");
  return (await gdprCookie.parse(cookieHeader)) || {};
}

export async function hasTrackingConsent({ request }: CookieArgs) {
  const cookie = await parseTrackingCookie({ request });
  const consentGiven = cookie[acceptCookiesFieldName];
  return consentGiven ? consentGiven === "true" : undefined;
}

export async function createTrackingCookie({
  request,
  consent,
}: CookieArgs & { consent?: boolean }) {
  const cookie = await parseTrackingCookie({ request });
  cookie[acceptCookiesFieldName] =
    consent == undefined ? consent : String(consent);
  return await gdprCookie.serialize(cookie);
}
