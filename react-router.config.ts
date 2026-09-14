import type { Config } from "@react-router/dev/config";

export default {
  ssr: true,
  routeDiscovery: { mode: "initial" }, // Disable lazy route discovery (see ADR 28)
  splitRouteModules: true,
  allowedActionOrigins: [
    "id.bund.de",
    "int.id.bund.de",
    "**.tech.digitalservice.dev", // Allow all subdomains of tech.digitalservice.dev due issues with react-router version 8.3.1
    "*.justiz.de", // Allow all subdomains of justiz.de due issues with react-router version 8.3.1
  ],
} satisfies Config;
