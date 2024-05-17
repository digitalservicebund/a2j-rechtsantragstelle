import { sentryVitePlugin } from "@sentry/vite-plugin";
import { vitePlugin as remix } from "@remix-run/dev";
import { installGlobals } from "@remix-run/node";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { cjsInterop } from "vite-plugin-cjs-interop";

installGlobals();
const isStorybook = process.argv[1]?.includes("storybook");
const sentryActive = Boolean(process.env.SENTRY_AUTH_TOKEN);

export default defineConfig({
  server: {
    port: 3000,
    hmr: { protocol: "ws", port: 24678 },
  },
  plugins: [
    !isStorybook && remix(),
    !isStorybook &&
      sentryActive &&
      sentryVitePlugin({
        org: "digitalservice",
        project: "a2j-rast",
        telemetry: false,
      }),
    tsconfigPaths(),
    cjsInterop({
      dependencies: ["@digitalservicebund/icons/*"],
    }),
  ],
  build: { sourcemap: sentryActive },
});
