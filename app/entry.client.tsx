import { useLocation, useMatches, RemixBrowser } from "@remix-run/react";
import * as Sentry from "@sentry/remix";
import { startTransition, StrictMode, useEffect } from "react";
import { hydrateRoot } from "react-dom/client";
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
      // eslint disabled because of https://github.com/import-js/eslint-plugin-import/issues/2969
      // TODO: use TS import resolver
      // eslint-disable-next-line import/namespace
      Sentry.replayIntegration(),
    ],
    tracesSampleRate: 1.0,
    // TODO: reduce replaysSessionSampleRate (e.g. to 0.1) when replays appear reliably in Sentry
    replaysSessionSampleRate: 1.0,
    replaysOnErrorSampleRate: 1.0,
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
