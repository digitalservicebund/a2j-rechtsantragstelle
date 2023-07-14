import { useLocation, useMatches, RemixBrowser } from "@remix-run/react";
import { startTransition, StrictMode, useEffect } from "react";
import { hydrateRoot } from "react-dom/client";
import * as Sentry from "@sentry/remix";
import { getWebConfig } from "./services/config";

if (getWebConfig().SENTRY_DSN) {
  Sentry.init({
    dsn: getWebConfig().SENTRY_DSN,
    environment: getWebConfig().ENVIRONMENT,
    integrations: [
      new Sentry.BrowserTracing({
        routingInstrumentation: Sentry.remixRouterInstrumentation(
          useEffect,
          useLocation,
          useMatches,
        ),
      }),
    ],
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
