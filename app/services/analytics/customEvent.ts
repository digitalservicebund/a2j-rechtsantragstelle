import { type UserData } from "~/domains/userData";
import { posthogIdFromCookie } from "~/services/analytics/posthogIdFromCookie";
import { getPosthogNodeClient } from "./posthogClient.server";

export function sendCustomAnalyticsEvent({
  request,
  eventName,
  properties,
}: {
  request: Request;
  eventName: string;
  properties?: UserData;
}) {
  getPosthogNodeClient()?.capture({
    distinctId: posthogIdFromCookie(request.headers.get("Cookie")),
    event: eventName,
    properties: {
      $current_url: new URL(request.url).pathname,
      ...properties,
    },
  });
}
