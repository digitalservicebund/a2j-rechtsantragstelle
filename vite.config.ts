/// <reference types="vitest" />
import { sentryVitePlugin } from "@sentry/vite-plugin";
import { vitePlugin as remix } from "@remix-run/dev";
import { installGlobals } from "@remix-run/node";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { envOnlyMacros } from "vite-env-only";

installGlobals();
const isStorybook = process.argv[1]?.includes("storybook");
const isVitest = process.env.VITEST !== undefined;
const sentryActive = Boolean(process.env.SENTRY_AUTH_TOKEN);

export default defineConfig({
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
        },
      }),
    !isStorybook &&
      sentryActive &&
      sentryVitePlugin({
        org: "digitalservice",
        project: "a2j-rast",
        telemetry: false,
      }),
    tsconfigPaths(),
    sentryVitePlugin({
      org: "digitalservice",
      project: "a2j-rast",
    }),
  ],
  build: { sourcemap: sentryActive },
  test: {
    dir: "./",
    include: ["**/__test__/*.test.{ts,tsx}", "**/unit/**/*.test.ts"],
    globals: true,
    environment: "jsdom",
    setupFiles: ["./tests/unit/vitest.setup.ts"],
    coverage: {
      provider: "istanbul",
      include: ["app/**"],
      exclude: ["app/**/__test__/**", "app/routes/**"],
      reporter: ["text", "lcov"],
    },
  },
});
