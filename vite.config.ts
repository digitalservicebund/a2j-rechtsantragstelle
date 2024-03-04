import { vitePlugin as remix } from "@remix-run/dev";
import { installGlobals } from "@remix-run/node";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { cjsInterop } from "vite-plugin-cjs-interop";

installGlobals();
const isStorybook = process.argv[1]?.includes("storybook");

export default defineConfig({
  server: {
    port: 3000,
  },
  plugins: [
    !isStorybook && remix(),
    tsconfigPaths(),
    cjsInterop({
      dependencies: ["@digitalservicebund/icons/*"],
    }),
  ],
});
