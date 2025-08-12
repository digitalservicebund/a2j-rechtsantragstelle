import { sentryVitePlugin } from "@sentry/vite-plugin";
import { reactRouter } from "@react-router/dev/vite";
import {
  sentryReactRouter,
  type SentryReactRouterBuildOptions,
} from "@sentry/react-router";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import tailwindcss from "@tailwindcss/vite";
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
    !isStorybook &&
      !isVitest &&
      buildSentrySourceMaps &&
      sentryVitePlugin(sentryConfig),
    !isStorybook &&
      !isVitest &&
      buildSentrySourceMaps &&
      sentryReactRouter(sentryConfig, config),
    tsconfigPaths(),
    tailwindcss(),
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
    projects: [
      {
        extends: true,
        test: {
          include: ["./app/**/__test__/*.test.{ts,tsx}"],
          exclude: ["./app/components/**/__test__/*.test.{ts,tsx}"],
          name: "unit",
        },
      },
      {
        extends: true,
        test: {
          include: ["./app/components/**/__test__/*.test.{ts,tsx}"],
          name: "component",
          environment: "jsdom",
        },
      },
      {
        extends: true,
        test: {
          dir: "./tests/integration",
          name: "integration",
          pool: "forks",
        },
      },
    ],
  },
}));
