import { defineWorkspace } from "vitest/config";

export default defineWorkspace([
  {
    extends: "./vite.config.ts",
    test: {
      include: ["./app/**/__test__/*.test.{ts,tsx}"],
      exclude: ["./app/components/**/__test__/*.test.{ts,tsx}"],
      name: "unit",
    },
  },
  {
    extends: "./vite.config.ts",
    test: {
      include: ["./app/components/**/__test__/*.test.{ts,tsx}"],
      name: "component",
      environment: "jsdom",
    },
  },
  {
    extends: "./vite.config.ts",
    test: {
      dir: "./tests/integration",
      name: "integration",
      pool: "forks",
    },
  },
]);
