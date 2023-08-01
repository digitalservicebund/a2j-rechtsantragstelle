import { createCookie } from "@remix-run/node";

export const acceptCookiesFieldName = "accept-cookies";
export const consentCookieName = "gdpr-consent";
export const gdprCookie = createCookie(consentCookieName, {
  maxAge: 365 * 24 * 60 * 60,
});

type CookieArgs = { request: Request };

async function parseTrackingCookie({
  request,
}: CookieArgs): Promise<Record<string, string | undefined>> {
  const cookieHeader = request.headers.get("Cookie");
  return (await gdprCookie.parse(cookieHeader)) || {};
}

export async function trackingCookieValue({ request }: CookieArgs) {
  const cookie = await parseTrackingCookie({ request });
  return cookie[acceptCookiesFieldName];
}

export async function hasTrackingConsent({ request }: CookieArgs) {
  const consentGiven = await trackingCookieValue({ request });
  return consentGiven ? consentGiven === "true" : undefined;
}

async function createTrackingCookie({
  request,
  consent,
}: CookieArgs & { consent?: boolean }) {
  const cookie = await parseTrackingCookie({ request });
  cookie[acceptCookiesFieldName] =
    consent == undefined ? consent : String(consent);
  return gdprCookie.serialize(cookie);
}

export async function consentCookieFromRequest({
  request,
}: {
  request: Request;
}) {
  const formData = await request.formData();
  const fieldContent = formData.get(acceptCookiesFieldName);
  let consent = undefined;
  if (fieldContent === "true") consent = true;
  else if (fieldContent === "false") consent = false;
  return createTrackingCookie({ request, consent });
}
