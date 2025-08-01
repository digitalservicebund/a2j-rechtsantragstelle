/* eslint-disable no-console */
import * as Sentry from "@sentry/react-router";
import { config } from "~/services/env/public";

const { SENTRY_DSN, ENVIRONMENT } = config();
let sentryHasBeenInitialized = false;

if (SENTRY_DSN !== undefined) {
  Sentry.init({
    dsn: SENTRY_DSN,
    environment: ENVIRONMENT,

    tracesSampleRate: 0.1,
    replaysSessionSampleRate: 0.0,
    replaysOnErrorSampleRate: 0.0,

    sendDefaultPii: false,
    attachStacktrace: true,
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

export function logError({ message = undefined, error }: Error) {
  if (message) console.error(message, error);
  else console.error(error);
  // Log server exceptions to Sentry if possible
  Sentry.captureException(error);
}

export function sendSentryMessage(
  message: string,
  level: Sentry.SeverityLevel,
): void {
  if (sentryHasBeenInitialized) {
    Sentry.captureMessage(message, level);
  }
}
