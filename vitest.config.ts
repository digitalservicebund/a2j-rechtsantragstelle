import path from "node:path";
import { defineConfig } from "vitest/config";

const rootPath = path.resolve(__dirname);

export default defineConfig({
  test: {
    dir: "./app",
    globals: true,
    environment: "jsdom",
    setupFiles: ["./tests/unit/vitest.setup.ts"],
    coverage: {
      include: ["app/**"],
      exclude: ["app/**/*.test.{ts,tsx}", "app/routes/**"],
    },
  },
  resolve: {
    alias: {
      "~/": path.join(rootPath, "app/"),
      "data/": path.join(rootPath, "data/"),
      "tests/": path.join(rootPath, "tests/"),
    },
  },
});
