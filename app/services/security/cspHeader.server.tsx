// References:
// https://cheatsheetseries.owasp.org/cheatsheets/Content_Security_Policy_Cheat_Sheet.html
// https://web.dev/articles/strict-csp
// https://csp-evaluator.withgoogle.com/

import { isPresent } from "~/util/omitNull";
import { bucketUrl } from "../cms/bucketUrl";
import { config } from "../env/public";
import { POSTHOG_API_HOST } from "~/services/analytics/config";

const { BUNDID_IDP_ENTRY_POINT } = config();

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
      POSTHOG_API_HOST,
    ],
    "frame-src": ["www.youtube-nocookie.com"],
    "style-src": ["'self'", "'unsafe-inline'"],
    "font-src": ["'self'"],
    "connect-src": [
      "'self'",
      "openplzapi.org",
      bucketUrl,
      POSTHOG_API_HOST,
      ...(args.additionalConnectSrc ?? []),
    ].filter(isPresent),
    "img-src": [
      "'self'",
      bucketUrl,
      "https://mermaid.ink",
      "https://img.youtube.com",
      "data:",
    ].filter(isPresent),
    "form-action": ["'self'", BUNDID_IDP_ENTRY_POINT].filter(isPresent),
    "object-src": ["'none'"],
    "base-uri": ["'none'"],
    "frame-ancestors": ["'none'"],
    "upgrade-insecure-requests": [],
  };

  if (args.environment === "development") {
    directives["connect-src"].push("ws://localhost:24678"); // vite's HMR server
    directives["connect-src"].push("http://localhost:24678"); // vite's HMR server
    directives["connect-src"].push("http://localhost:1337"); // local strapi
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
