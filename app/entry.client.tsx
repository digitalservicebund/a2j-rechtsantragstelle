import * as Sentry from "@sentry/react-router";
import { startTransition, StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";
import { HydratedRouter } from "react-router/dom";
import { config } from "~/services/env/public";
import { sentrySharedConfig } from "./services/logging/sentrySettings";

const { SENTRY_DSN } = config();
// Ignore a few common errors that are not useful to track
const SENTRY_IGNORE_ERRORS = [
  "Error in input stream",
  "Load failed",
  "Detected manifest version mismatch, reloading...",
];

if (SENTRY_DSN !== undefined) {
  Sentry.init({
    ...sentrySharedConfig,
    tracePropagationTargets: [/^\/[^/]*/], //  enable trace propagation for all relative paths on same domain
    integrations: [Sentry.reactRouterTracingIntegration()],
    ignoreErrors: SENTRY_IGNORE_ERRORS,
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
