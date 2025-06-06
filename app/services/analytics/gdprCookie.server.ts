import { createCookie } from "react-router";
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

async function parseTrackingCookie({ request }: CookieArgs) {
  const cookieHeader = request.headers.get("Cookie");
  return ((await gdprCookie.parse(cookieHeader)) as GdprCookie) || {};
}

export async function trackingCookieValue({ request }: CookieArgs) {
  const cookie = await parseTrackingCookie({ request });
  return cookie[acceptCookiesFieldName];
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
    eventName: "responded to cookie banner",
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
