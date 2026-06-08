import { type UserData } from "~/domains/userData";
import { posthogIdFromCookie } from "~/services/analytics/posthogIdFromCookie";
import { getPosthogNodeClient } from "./posthogClient.server";

export function sendCustomAnalyticsEvent({
  request,
  eventName,
  properties,
  url,
}: {
  request: Request;
  eventName: string;
  properties?: UserData;
  url?: URL;
}) {
  getPosthogNodeClient()?.capture({
    distinctId: posthogIdFromCookie(request.headers.get("Cookie")),
    event: eventName,
    properties: {
      $current_url: url ? url.pathname : new URL(request.url).pathname,
      ...properties,
    },
  });
}
