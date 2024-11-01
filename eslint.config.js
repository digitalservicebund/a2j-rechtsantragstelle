import vitest from "@vitest/eslint-plugin";
import js from "@eslint/js";
import globals from "globals";
import react from "eslint-plugin-react";
import jsxA11y from "eslint-plugin-jsx-a11y";

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
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
        ...globals.commonjs,
        ...globals.es6,
      },
    },
  },
  // React
  {
    ...react.configs.flat.recommended,
    ...react.configs.flat["jsx-runtime"],
    /**
     * TODO: flat config of this plugin isn't available https://github.com/facebook/react/pull/30774
     * We could use technically use it (https://eslint.org/docs/latest/use/configure/migration-guide#using-eslintrc-configs-in-flat-config),
     * but it would add 3 dev dependencies, namely @eslint/eslintrc, path, and url
     */
    // ...reactHooks.configs.recommended,
    ...jsxA11y.flatConfigs.recommended,
    files: ["**/*.{js,jsx,ts,tsx}"],
    plugins: {
      react,
      "jsx-a11y": jsxA11y,
    },
    settings: {
      react: { version: "detect" },
      formComponents: ["Form"],
      linkComponents: [
        { name: "Link", linkAttribute: "to" },
        { name: "NavLink", linkAttribute: "to" },
      ],
    },
    rules: {
      "react/jsx-no-leaked-render": ["off", { validStrategies: ["ternary"] }], // TODO: enable later
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
