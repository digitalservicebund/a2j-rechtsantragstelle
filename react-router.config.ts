import type { Config } from "@react-router/dev/config";

export default {
  ssr: true,
  routeDiscovery: { mode: "initial" }, // Disable lazy route discovery (see ADR 28)
  splitRouteModules: true,
  allowedActionOrigins: ["id.bund.de", "int.id.bund.de"],
} satisfies Config;
