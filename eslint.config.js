import vitest from "@vitest/eslint-plugin";
import eslint from "@eslint/js";
import globals from "globals";
import react from "eslint-plugin-react";
import jsxA11y from "eslint-plugin-jsx-a11y";
import importPlugin from "eslint-plugin-import";
import tseslint from "typescript-eslint";
import sonarjs from "eslint-plugin-sonarjs";

const { recommended, stylistic } = tseslint.configs;
const { recommended: importRecommended, typescript: importTypescript } =
  importPlugin.flatConfigs;

export default tseslint.config(
  eslint.configs.recommended,
  // Global ignores
  {
    ignores: ["**/*", "!app/**", "!tests/**", "!scripts/**"],
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
        ...globals.node,
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
  // Typescript
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      ...recommended,
      ...stylistic,
      importRecommended,
      importTypescript,
      sonarjs.configs.recommended,
    ],
    languageOptions: {
      parser: tseslint.parser,
    },
    settings: {
      "import/internal-regex": "^~/",
      "import/resolver": {
        node: { extensions: [".ts", ".tsx"] },
        typescript: { alwaysTryTypes: true },
      },
    },
    rules: {
      "import/no-cycle": "warn",
      "no-console": "warn",
      "sonarjs/no-duplicate-string": "off",
      "sonarjs/prefer-enum-initializers": "off", // currently breaks at runtime with TypeError: Cannot read properties of undefined (reading 'members')
      "sonarjs/todo-tag": "warn",
      "sonarjs/fixme-tag": "warn",
      "sonarjs/no-commented-code": "warn",
      "sonarjs/jsx-no-constructed-context-values": "warn",
      "sonarjs/new-cap": "off",
      "sonarjs/no-array-index-key": "warn",
      "sonarjs/no-empty-test-file": "off",
      "sonarjs/no-redeclare": "off",
      "sonarjs/no-nested-functions": "warn",
      "sonarjs/sonar-no-unused-vars": "off",
      "sonarjs/no-unstable-nested-components": "warn", //enable later
      "@typescript-eslint/ban-ts-comment": "off", // enable later
      "@typescript-eslint/consistent-type-definitions": "off", // enable later
      "@typescript-eslint/consistent-type-imports": "warn",
      "@typescript-eslint/array-type": "off", // enable later
      "@typescript-eslint/consistent-indexed-object-style": "off", // enable later
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],

      "import/order": [
        "warn",
        {
          alphabetize: { caseInsensitive: true, order: "asc" },
          groups: ["builtin", "external", "internal"],
          "newlines-between": "never",
        },
      ],
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
);
