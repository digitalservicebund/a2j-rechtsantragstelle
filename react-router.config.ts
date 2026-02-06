import type { Config } from "@react-router/dev/config";

export default {
  ssr: true,
  routeDiscovery: { mode: "initial" }, // Disable lazy route discovery (see ADR 28)
  future: {
    v8_splitRouteModules: true,
    v8_viteEnvironmentApi: true,
    v8_middleware: true,
  },
  allowedActionOrigins: ["https://id.bund.de", "https://int.id.bund.de"],
} satisfies Config;
