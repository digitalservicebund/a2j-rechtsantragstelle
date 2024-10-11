/* eslint-disable no-console */
import * as Sentry from "@sentry/remix";
import { config } from "~/services/env/web";

const IS_REMIX_V2 = true;

const { SENTRY_DSN, ENVIRONMENT } = config();
let sentryHasBeenInitialized = false;
if (SENTRY_DSN !== undefined) {
  Sentry.init({
    dsn: SENTRY_DSN,
    environment: ENVIRONMENT,
    autoInstrumentRemix: true,
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
    Sentry.captureRemixServerException(error, "server", request, IS_REMIX_V2);
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
