// References:
// https://cheatsheetseries.owasp.org/cheatsheets/Content_Security_Policy_Cheat_Sheet.html
// https://web.dev/articles/strict-csp
// https://csp-evaluator.withgoogle.com/

type Directives = {
  [key in
    | "default-src"
    | "script-src"
    | "style-src"
    | "connect-src"
    | "img-src"
    | "object-src"
    | "base-uri"
    | "frame-ancestors"]: string[];
} & { "font-src"?: string[] };

export const cspHeader = (args?: { nonce?: string; environment?: string }) => {
  const directives: Directives = {
    "default-src": ["'self'"],
    "script-src": [
      "'self'",
      "https://*.posthog.com",
      "https:",
      "'unsafe-inline'",
    ],
    "style-src": ["'self'", "'unsafe-inline'"],
    "connect-src": [
      "'self'",
      "https://*.ingest.sentry.io",
      "https://*.posthog.com",
    ],
    "img-src": [
      "'self'",
      "https://a2j-rechtsantragstelle-infra-public-assets-bucket.obs.eu-de.otc.t-systems.com",
      "https://mermaid.ink",
      "data:",
    ],
    "object-src": ["'none'"],
    "base-uri": ["'none'"],
    "frame-ancestors": ["'none'"],
  };

  if (args?.nonce) {
    directives["script-src"].push(`'nonce-${args.nonce}'`);
    directives["script-src"].push("'strict-dynamic'");
  }

  if (args?.environment === "development") {
    directives["connect-src"].push("ws://localhost:24678"); // vite's HMR server
    directives["img-src"].push("localhost:*");
  }

  if (args?.environment === "preview") {
    directives["script-src"].push("https://snippet.maze.co");
    directives["style-src"].push("https://snippet.maze.co");
    directives["img-src"].push("https://snippet.maze.co");
    directives["connect-src"].push(
      "https://api.maze.co",
      "https://prompts.maze.co",
    );
    directives["font-src"] = ["https://snippet.maze.co"];
  }

  return Object.entries(directives)
    .map(([key, values]) => `${key} ${values.join(" ")}`)
    .join("; ");
};
