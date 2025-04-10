import { useLocation, useMatches, RemixBrowser } from "@remix-run/react";
import * as Sentry from "@sentry/remix";
import { startTransition, StrictMode, useEffect } from "react";
import { hydrateRoot } from "react-dom/client";
import { config } from "~/services/env/web";

// Ignore a few common errors that are not useful to track
const SENTRY_IGNORE_ERRORS = ["Error in input stream", "Load failed"];

const { SENTRY_DSN, ENVIRONMENT } = config();
if (SENTRY_DSN !== undefined) {
  Sentry.init({
    dsn: SENTRY_DSN,
    environment: ENVIRONMENT,
    integrations: [
      Sentry.browserTracingIntegration({
        useEffect,
        useLocation,
        useMatches,
      }),
    ],
    ignoreErrors: SENTRY_IGNORE_ERRORS,
  });
}

function hydrate() {
  startTransition(() => {
    hydrateRoot(
      document,
      <StrictMode>
        <RemixBrowser />
      </StrictMode>,
    );
  });
}

if (typeof requestIdleCallback === "function") {
  requestIdleCallback(hydrate);
} else {
  // Safari doesn't support requestIdleCallback
  // https://caniuse.com/requestidlecallback
  setTimeout(hydrate, 1);
}
