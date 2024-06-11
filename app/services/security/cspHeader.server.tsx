// References:
// https://cheatsheetseries.owasp.org/cheatsheets/Content_Security_Policy_Cheat_Sheet.html
// https://web.dev/articles/strict-csp
// https://csp-evaluator.withgoogle.com/

export const cspHeader = (args?: { nonce?: string; environment?: string }) =>
  [
    `default-src 'self' ${args?.environment === "preview" ? "https://*.maze.co/" : ""}`, // todo: remove after evaluating maze
    `script-src 'self' ${args?.nonce ? "'nonce-" + args.nonce + "' 'strict-dynamic'" : ""} https://*.posthog.com https: 'unsafe-inline'`,
    `style-src 'self' 'unsafe-inline'`,
    `connect-src 'self' https://*.ingest.sentry.io https://*.posthog.com ${args?.environment === "development" ? "ws://localhost:24678" : ""}`, // ws://localhost:24678 is vite's HMR server
    `img-src 'self' https://a2j-rechtsantragstelle-infra-public-assets-bucket.obs.eu-de.otc.t-systems.com https://mermaid.ink data: ${args?.environment === "development" ? "localhost:*" : ""}`,
    `object-src 'none'`,
    `base-uri 'none'`,
    `frame-ancestors 'none'`,
  ].join("; ");
