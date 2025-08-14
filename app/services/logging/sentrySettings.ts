import type * as Sentry from "@sentry/react-router";
import { config } from "../env/public";

const { SENTRY_DSN, ENVIRONMENT } = config();

export const sentrySharedConfig: Sentry.BrowserOptions | Sentry.NodeOptions = {
  dsn: SENTRY_DSN,
  environment: ENVIRONMENT,
  sampleRate: 1.0, // send all errors
  tracesSampleRate: 0.001, // send performance trace on every 1000th event
  replaysSessionSampleRate: 0.0,
  replaysOnErrorSampleRate: 0.0,
  sendDefaultPii: false,
  attachStacktrace: true,
};
