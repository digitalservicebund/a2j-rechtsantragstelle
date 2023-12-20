import { PostHog } from "posthog-node";
import { hasTrackingConsent } from "./gdprCookie.server";
import { config } from "../env/web";
import { parse } from "cookie";

const { POSTHOG_API_KEY, POSTHOG_API_HOST, ENVIRONMENT } = config();
const posthogClient = POSTHOG_API_KEY
  ? new PostHog(POSTHOG_API_KEY, { host: POSTHOG_API_HOST })
  : undefined;

function idFromCookie(request: Request) {
  // Note: can't use cookie.parse(): https://github.com/remix-run/remix/discussions/5198
  // Returns ENVIRONMENT if posthog's distinct_id can't be extracted
  if (!POSTHOG_API_KEY) return ENVIRONMENT;
  const parsedCookie = parse(request.headers.get("Cookie") ?? "");
  const phCookieString = parsedCookie[`ph_${POSTHOG_API_KEY}_posthog`] ?? "{}";
  const phCookieObject = JSON.parse(phCookieString) as Record<string, string>;
  return phCookieObject["distinct_id"] ?? ENVIRONMENT;
}

export async function sendCustomEvent(
  eventName: string,
  context: Record<string, any>,
  request: Request,
) {
  if (!posthogClient || !(await hasTrackingConsent({ request }))) return;

  posthogClient.capture({
    distinctId: idFromCookie(request),
    event: eventName,
    properties: {
      // eslint-disable-next-line camelcase
      $current_url: new URL(request.url).pathname,
      ...context,
    },
  });
}
