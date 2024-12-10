import { defineWorkspace } from "vitest/config";

export default defineWorkspace([
  {
    extends: "./vite.config.ts",
    test: {
      dir: "./",
      include: ["**/__test__/*.test.{ts,tsx}", "**/unit/**/*.test.ts"],
      name: "unit",
    },
  },
  {
    extends: "./vite.config.ts",
    test: {
      dir: "./tests/integration",
      name: "integration",
    },
  },
]);
