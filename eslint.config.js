import vitest from "@vitest/eslint-plugin";
import js from "@eslint/js";
import globals from "globals";

export default [
  js.configs.recommended,
  // Global ignores
  {
    ignores: ["/*", "!/app", "!/tests", "*.generated.ts", "!/scripts"],
  },
  // Global overrides
  {
    languageOptions: {
      parserOptions: {
        jsx: true,
      },
      globals: {
        ...globals.browser,
        ...globals.commonjs,
        ...globals.es6,
      },
    },
  },
  // Vitest
  {
    files: ["app/**/*.test.{js,jsx,ts,tsx}"],
    plugins: {
      vitest,
    },
    rules: {
      ...vitest.configs.recommended.rules,
      "vitest/valid-title": "off", // TODO: enable later
      "require-await": "error",
    },
  },
];
