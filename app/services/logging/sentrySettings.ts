import type * as Sentry from "@sentry/react-router";
import { config } from "../env/public";

const { SENTRY_DSN, ENVIRONMENT } = config();

export const sentrySharedConfig: Sentry.BrowserOptions | Sentry.NodeOptions = {
  dsn: SENTRY_DSN,
  environment: ENVIRONMENT,
  sampleRate: 1.0, // send all errors
  tracesSampleRate: 0.002, // aiming for for 100 transactions/day (check sentry stats)
  replaysSessionSampleRate: 0.0,
  replaysOnErrorSampleRate: 0.0,
  sendDefaultPii: false,
  attachStacktrace: true,
};
