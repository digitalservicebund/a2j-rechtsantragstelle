import { config } from "~/services/env/web";
import * as Sentry from "@sentry/remix";

const { SENTRY_DSN, ENVIRONMENT } = config();
if (SENTRY_DSN !== undefined) {
  Sentry.init({
    dsn: SENTRY_DSN,
    environment: ENVIRONMENT,
  });
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
