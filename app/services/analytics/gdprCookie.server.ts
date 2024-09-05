import { createCookie } from "@remix-run/node";
import { useSecureCookie } from "~/util/useSecureCookie";
import { sendCustomAnalyticsEvent } from "./customEvent";
import { acceptCookiesFieldName } from "../../components/cookieBanner/CookieBanner";

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

export function isCookieConsentExist(cookieHeaders: string | null): boolean {
  const cookies = cookieHeaders?.split(";");

  if (typeof cookies === "undefined") {
    return false;
  }

  return cookies.some((cookie) => cookie.includes(consentCookieName));
}

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
  const stringifiedConsentValue = consent ? "true" : "false";
  if (cookie[acceptCookiesFieldName] === stringifiedConsentValue)
    return {} as HeadersInit;
  cookie[acceptCookiesFieldName] =
    consent === undefined ? undefined : stringifiedConsentValue;
  sendCustomAnalyticsEvent({
    eventName: "cookie consent given",
    request,
    properties: { consent: stringifiedConsentValue },
  });
  return { "Set-Cookie": await gdprCookie.serialize(cookie) } as HeadersInit;
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
