import { config } from "../env/web";
import { parse } from "cookie";
import { getPosthogClient } from "./posthogClient.server";
import type { Context } from "~/models/flows/contexts";

function idFromCookie(request: Request) {
  // Note: can't use cookie.parse(): https://github.com/remix-run/remix/discussions/5198
  // Returns ENVIRONMENT if posthog's distinct_id can't be extracted
  const { POSTHOG_API_KEY, ENVIRONMENT } = config();
  if (!POSTHOG_API_KEY) return ENVIRONMENT;
  const parsedCookie = parse(request.headers.get("Cookie") ?? "");
  const phCookieString = parsedCookie[`ph_${POSTHOG_API_KEY}_posthog`] ?? "{}";
  const phCookieObject = JSON.parse(phCookieString) as Record<string, string>;
  return phCookieObject["distinct_id"] ?? ENVIRONMENT;
}

export function sendCustomEvent({
  request,
  eventName,
  context,
  properties,
}: {
  request: Request;
  eventName: string;
  context?: Context;
  properties?: Record<string, string | boolean | undefined>;
}) {
  getPosthogClient()?.capture({
    distinctId: idFromCookie(request),
    event: eventName,
    properties: {
      ...context,
      // eslint-disable-next-line camelcase
      $current_url: new URL(request.url).pathname,
      ...properties,
    },
  });
}
