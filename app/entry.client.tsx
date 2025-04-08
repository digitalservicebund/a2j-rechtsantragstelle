import * as Sentry from "@sentry/remix";
import { startTransition, StrictMode, useEffect } from "react";
import { hydrateRoot } from "react-dom/client";
import { useLocation, useMatches } from "react-router";
import { HydratedRouter } from "react-router/dom";
import { config } from "~/services/env/web";

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
  });
}

function hydrate() {
  startTransition(() => {
    hydrateRoot(
      document,
      <StrictMode>
        <HydratedRouter />
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
