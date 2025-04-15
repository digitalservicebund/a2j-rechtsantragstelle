import { sentryVitePlugin } from "@sentry/vite-plugin";
import { reactRouter } from "@react-router/dev/vite";
import {
  sentryReactRouter,
  type SentryReactRouterBuildOptions,
} from "@sentry/react-router";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { envOnlyMacros } from "vite-env-only";

const isStorybook = process.argv[1]?.includes("storybook");
const isVitest = process.env.VITEST !== undefined;
const buildSentrySourceMaps = Boolean(process.env.SENTRY_AUTH_TOKEN);

const sentryConfig: SentryReactRouterBuildOptions = {
  org: "digitalservice",
  project: "a2j-rast",
  authToken: process.env.SENTRY_AUTH_TOKEN,
  telemetry: false,
};

export default defineConfig((config) => ({
  server: {
    port: 3000,
    hmr: { protocol: "ws", port: 24678 },
  },
  plugins: [
    envOnlyMacros(),
    !isStorybook && !isVitest && reactRouter(),
    !isStorybook && buildSentrySourceMaps && sentryVitePlugin(sentryConfig),
    !isStorybook &&
      buildSentrySourceMaps &&
      sentryReactRouter(sentryConfig, config),
    tsconfigPaths(),
  ],
  build: {
    sourcemap: buildSentrySourceMaps,
    target: config.isSsrBuild ? "esnext" : undefined, // Allows top-level await in server-only files
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
