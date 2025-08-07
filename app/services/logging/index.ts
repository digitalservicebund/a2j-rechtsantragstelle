/* eslint-disable no-console */
import * as Sentry from "@sentry/react-router";
import { config } from "~/services/env/public";

const { SENTRY_DSN, ENVIRONMENT } = config();
// Ignore a few common errors that are not useful to track
const SENTRY_IGNORE_ERRORS = [
  // BundID related - ignore while work is in progress
  "ERR_FAILED_STATUS with top tier code: urn:oasis:names:tc:SAML:2.0:status:Requester, second tier code: urn:oasis:names:tc:SAML:2.0:status:AuthnFailed",
  "signature algorithm 'http://www.w3.org/2007/05/xmldsig-more#sha256-rsa-MGF1' is not supported",
];

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
    ignoreErrors: SENTRY_IGNORE_ERRORS,
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
