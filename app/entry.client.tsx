import * as Sentry from "@sentry/react-router";
import { startTransition, StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";
import { HydratedRouter } from "react-router/dom";
import { config } from "~/services/env/public";

const { SENTRY_DSN, ENVIRONMENT } = config();
if (SENTRY_DSN !== undefined) {
  Sentry.init({
    dsn: SENTRY_DSN,
    environment: ENVIRONMENT,

    tracesSampleRate: 0.2,
    replaysSessionSampleRate: 0.0,
    replaysOnErrorSampleRate: 0.0,

    sendDefaultPii: false,
    attachStacktrace: true,

    tracePropagationTargets: [
      /^\//, //  This enables trace propagation for all relative paths on the same domain.
      /.*\/beratungshilfe\/antrag.*/,
      /.*\/geld-einklagen\/formular.*/,
      /.*\/fluggastrechte\/formular.*/,
      /.*\/prozesskostenhilfe\/formular.*/,
    ],
    integrations: [Sentry.reactRouterTracingIntegration()],
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
