import { type UserData } from "~/domains/userData";
import { idFromCookie } from "~/services/analytics/posthogHelpers";
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
    distinctId: idFromCookie(request.headers.get("Cookie")),
    event: eventName,
    properties: {
      $current_url: new URL(request.url).pathname,
      ...properties,
    },
  });
}
