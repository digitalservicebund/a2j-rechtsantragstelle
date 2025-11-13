import type { Config } from "@react-router/dev/config";

export default {
  ssr: true,
  // Disable lazy route discovery (see ADR 28)
  routeDiscovery: { mode: "initial" },
} satisfies Config;
