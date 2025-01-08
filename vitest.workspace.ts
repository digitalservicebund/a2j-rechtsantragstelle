import { defineWorkspace } from "vitest/config";

export default defineWorkspace([
  {
    extends: "./vite.config.ts",
    test: {
      include: ["./app/**/__test__/*.test.{ts,tsx}"],
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
