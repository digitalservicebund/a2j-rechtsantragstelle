import { sentryVitePlugin } from "@sentry/vite-plugin";
import { vitePlugin as remix } from "@remix-run/dev";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { envOnlyMacros } from "vite-env-only";

const isStorybook = process.argv[1]?.includes("storybook");
const isVitest = process.env.VITEST !== undefined;
const buildSentrySourceMaps = Boolean(process.env.SENTRY_AUTH_TOKEN);

export default defineConfig(({ isSsrBuild }) => ({
  server: {
    port: 3000,
    hmr: { protocol: "ws", port: 24678 },
  },
  plugins: [
    envOnlyMacros(),
    !isStorybook &&
      !isVitest &&
      remix({
        future: {
          v3_fetcherPersist: true,
          v3_relativeSplatPath: true,
          v3_throwAbortReason: true,
          v3_lazyRouteDiscovery: false,
          v3_singleFetch: false,
        },
      }),
    !isStorybook &&
      buildSentrySourceMaps &&
      sentryVitePlugin({
        org: "digitalservice",
        project: "a2j-rast",
        authToken: process.env.SENTRY_AUTH_TOKEN,
        telemetry: false,
      }),
    tsconfigPaths(),
  ],
  build: {
    sourcemap: buildSentrySourceMaps,
    target: isSsrBuild ? "esnext" : undefined, // Allows top-level await in server-only files
  },
  test: {
    globals: true,
    environment: "node",
    setupFiles: ["vitest.setup.ts"],
    pool: "threads",
    coverage: {
      provider: "istanbul",
      include: ["app/**"],
      exclude: ["app/**/__test__/**", "app/routes/**"],
      reporter: ["text", "lcov"],
    },
  },
}));
