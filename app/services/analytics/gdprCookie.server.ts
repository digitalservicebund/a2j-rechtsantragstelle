import { createCookie } from "@remix-run/node";
import { acceptCookiesFieldName } from "./Analytics";
import { useSecureCookie } from "~/util/useSecureCookie";
import { sendCustomEvent } from "./customEvent";

export const consentCookieName = "gdpr-consent";

const gdprCookie = createCookie(consentCookieName, {
  maxAge: 365 * 24 * 60 * 60,
  sameSite: "lax",
  httpOnly: true,
  secure: useSecureCookie,
});

type GdprCookie = {
  [acceptCookiesFieldName]: "true" | "false" | undefined;
};

type CookieArgs = { request: Request };

async function parseTrackingCookie({ request }: CookieArgs) {
  const cookieHeader = request.headers.get("Cookie");
  return ((await gdprCookie.parse(cookieHeader)) as GdprCookie) || {};
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
  let cookieUpdated = false;
  const stringifiedConsentValue = consent ? "true" : "false";
  if (cookie[acceptCookiesFieldName] !== stringifiedConsentValue) {
    cookie[acceptCookiesFieldName] =
      consent === undefined ? undefined : stringifiedConsentValue;
    sendCustomEvent({
      eventName: "cookie consent given",
      request,
      properties: { consent: stringifiedConsentValue },
    });
    cookieUpdated = true;
  }
  return {
    cookie: await gdprCookie.serialize(cookie),
    updated: cookieUpdated,
  };
}

export async function consentCookieFromRequest({
  request,
}: {
  request: Request;
}): Promise<Record<string, string | never>> {
  const formData = await request.formData();
  const fieldContent = formData.get(acceptCookiesFieldName);
  let consent = undefined;
  if (fieldContent === "true") consent = true;
  else if (fieldContent === "false") consent = false;
  const { cookie, updated } = await createTrackingCookie({ request, consent });
  return updated ? { "Set-Cookie": cookie } : {};
}
