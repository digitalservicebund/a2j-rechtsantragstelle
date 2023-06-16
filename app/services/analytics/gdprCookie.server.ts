import { createCookie } from "@remix-run/node";

export const gdprCookie = createCookie("gdpr-consent", {
  maxAge: 365 * 24 * 60 * 60,
});

export async function hasTrackingConsent({ request }: { request: Request }) {
  return (await getTrackingCookie({ request })).gdprConsent == "true";
}

export async function createTrackingCookie({
  request,
  consent,
}: {
  request: Request;
  consent: boolean;
}) {
  const cookie = await getTrackingCookie({ request });
  cookie.gdprConsent = consent ? "true" : "false";
  return await gdprCookie.serialize(cookie);
}

export async function getTrackingCookie({ request }: { request: Request }) {
  const cookieHeader = request.headers.get("Cookie");
  return (await gdprCookie.parse(cookieHeader)) || {};
}
