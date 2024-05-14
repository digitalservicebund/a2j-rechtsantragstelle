import { config } from "~/services/env/env.server";

export const cspHeader = (cspNonce: string) =>
  `default-src 'self'; script-src 'self' 'nonce-${cspNonce}' https://*.posthog.com; style-src 'self' 'unsafe-inline'; connect-src ${
    config().ENVIRONMENT === "development"
      ? "*"
      : "'self' https://*.ingest.sentry.io https://*.posthog.com"
  };  img-src 'self' localhost:* https://a2j-rechtsantragstelle-infra-public-assets-bucket.obs.eu-de.otc.t-systems.com https://mermaid.ink data:`;
