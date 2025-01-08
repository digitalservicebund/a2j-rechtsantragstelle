// References:
// https://cheatsheetseries.owasp.org/cheatsheets/Content_Security_Policy_Cheat_Sheet.html
// https://web.dev/articles/strict-csp
// https://csp-evaluator.withgoogle.com/

import { bucketUrl } from "../cms/bucketUrl";

export const cspHeader = (args: {
  nonce: string;
  additionalConnectSrc?: string[];
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
      "eu-assets.i.posthog.com", // see https://posthog.com/docs/session-replay/troubleshooting#3-content-security-policy
    ],
    "frame-src": ["www.youtube-nocookie.com"],
    "style-src": ["'self'", "'unsafe-inline'", "fonts.googleapis.com"],
    "font-src": ["'self'", "fonts.gstatic.com"],
    "connect-src": [
      "'self'",
      "eu.i.posthog.com",
      bucketUrl,
      ...(args.additionalConnectSrc ?? []),
    ],
    "img-src": [
      "'self'",
      bucketUrl,
      "https://mermaid.ink",
      "https://img.youtube.com",
      "data:",
    ],
    "form-action ": [
      "'self'",
      "https://int.id.bund.de/idp/profile/SAML2/POST/SSO",
    ],
    "object-src": ["'none'"],
    "base-uri": ["'none'"],
    "frame-ancestors": ["'none'"],
    "upgrade-insecure-requests": [],
  };

  if (args.environment === "development") {
    directives["connect-src"].push("ws://localhost:24678"); // vite's HMR server
    directives["connect-src"].push("http://localhost:24678"); // vite's HMR server
    directives["img-src"].push("localhost:*");
    delete directives["upgrade-insecure-requests"]; // https://github.com/github/secure_headers/issues/348
  }
  if (args.reportUri) {
    directives["report-to"] = ["'csp-endpoint'"];
    directives["report-uri"] = [args.reportUri];
  }

  return Object.entries(directives)
    .map(([key, values]) => `${key} ${values.join(" ")}`)
    .join(";");
};
