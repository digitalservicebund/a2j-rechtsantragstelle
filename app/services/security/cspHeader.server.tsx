// References:
// https://cheatsheetseries.owasp.org/cheatsheets/Content_Security_Policy_Cheat_Sheet.html
// https://web.dev/articles/strict-csp
// https://csp-evaluator.withgoogle.com/

export const cspHeader = (cspNonce: string) =>
  [
    `default-src 'self'`,
    `script-src 'self' 'nonce-${cspNonce}' https://*.posthog.com 'strict-dynamic' https: 'unsafe-inline'`,
    `style-src 'self' 'unsafe-inline'`,
    `connect-src 'self' ws://localhost:24678 https://*.ingest.sentry.io https://*.posthog.com`, // localhost is vite's HMR server
    `img-src 'self' localhost:* https://a2j-rechtsantragstelle-infra-public-assets-bucket.obs.eu-de.otc.t-systems.com https://mermaid.ink data:`,
    `object-src 'none'`,
    `base-uri 'none'`,
    `frame-ancestors 'none'`,
  ].join("; ");
