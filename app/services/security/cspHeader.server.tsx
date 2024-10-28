// References:
// https://cheatsheetseries.owasp.org/cheatsheets/Content_Security_Policy_Cheat_Sheet.html
// https://web.dev/articles/strict-csp
// https://csp-evaluator.withgoogle.com/

export const cspHeader = (args: {
  nonce: string;
  trustedDomains: string[];
  reportUri?: string;
  environment: string;
}) => {
  const directives: Record<string, string[]> = {
    "default-src": ["'self'"],
    "script-src": [
      "'self'",
      "https:",
      `'nonce-${args.nonce}'`,
      "'strict-dynamic'",
      ...args.trustedDomains,
    ],
    "frame-src": ["www.youtube-nocookie.com"],
    "style-src": ["'self'", "'unsafe-inline'"],
    "connect-src": ["'self'", ...args.trustedDomains],
    "img-src": [
      "'self'",
      "https://a2j-rechtsantragstelle-infra-public-assets-bucket.obs.eu-de.otc.t-systems.com",
      "https://mermaid.ink",
      "https://img.youtube.com",
      "data:",
    ],
    "form-action ": ["'self'"],
    "object-src": ["'none'"],
    "base-uri": ["'none'"],
    "frame-ancestors": ["'none'"],
    "upgrade-insecure-requests": [],
  };

  if (args.environment === "development") {
    directives["connect-src"].push("ws://localhost:24678"); // vite's HMR server
    directives["img-src"].push("localhost:*");
  }
  if (args.reportUri) {
    directives["report-to"] = ["'csp-endpoint'"];
    directives["report-uri"] = [args.reportUri];
  }

  return Object.entries(directives)
    .map(([key, values]) => `${key} ${values.join(" ")}`)
    .join(";");
};
