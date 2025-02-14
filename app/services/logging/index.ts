/* eslint-disable no-console */
import * as Sentry from "@sentry/remix";
import { config } from "~/services/env/web";

const { SENTRY_DSN, ENVIRONMENT } = config();
let sentryHasBeenInitialized = false;
if (SENTRY_DSN !== undefined) {
  Sentry.init({
    dsn: SENTRY_DSN,
    environment: ENVIRONMENT,
  });
  sentryHasBeenInitialized = true;
}

export function logWarning(message: string) {
  console.warn(message);
}

type Error = {
  message?: string;
  error: unknown;
  request?: Request;
};

export function logError({
  message = undefined,
  error,
  request = undefined,
}: Error) {
  if (message) console.error(message, error);
  else console.error(error);
  // Log server exceptions to Sentry if possible
  if (error instanceof Error && request) {
    void Sentry.captureRemixServerException(error, "server", request);
  } else {
    Sentry.captureException(error);
  }
}

export function sendSentryMessage(
  message: string,
  level: Sentry.SeverityLevel,
): void {
  if (sentryHasBeenInitialized) {
    Sentry.captureMessage(message, level);
  }
}
