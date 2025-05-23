import { type UserData } from "~/domains/userData";
import { idFromCookie } from "~/services/analytics/posthogHelpers";
import { getPosthogClient } from "./posthogClient.server";

export function sendCustomAnalyticsEvent({
  request,
  eventName,
  properties,
}: {
  request: Request;
  eventName: string;
  properties?: UserData;
}) {
  getPosthogClient()?.capture({
    distinctId: idFromCookie(request.headers.get("Cookie")),
    event: eventName,
    properties: {
      $current_url: new URL(request.url).pathname,
      ...properties,
    },
  });
}
