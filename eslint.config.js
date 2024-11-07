import vitest from "@vitest/eslint-plugin";
import { FlatCompat } from "@eslint/eslintrc";
import eslint from "@eslint/js";
import globals from "globals";
import react from "eslint-plugin-react";
import jsxA11y from "eslint-plugin-jsx-a11y";
import importPlugin from "eslint-plugin-import";
import tseslint from "typescript-eslint";
import sonarjs from "eslint-plugin-sonarjs";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
});

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
    files: ["**/*.{js,jsx,ts,tsx}"],
    extends: [
      react.configs.flat.recommended,
      react.configs.flat["jsx-runtime"],
      /**
       * TODO: flat config of this plugin isn't available yet https://github.com/facebook/react/pull/30774
       */
      ...compat.extends("plugin:react-hooks/recommended"),
      jsxA11y.flatConfigs.recommended,
    ],
    plugins: {
      react,
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
      ...tseslint.configs.recommendedTypeChecked,
      ...tseslint.configs.stylisticTypeChecked,
      importPlugin.flatConfigs.recommended,
      importPlugin.flatConfigs.typescript,
      sonarjs.configs.recommended,
    ],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    settings: {
      "import/internal-regex": "^~/",
      "import/resolver": {
        node: { extensions: [".ts", ".tsx"] },
        typescript: { alwaysTryTypes: true },
      },
    },
    rules: {
      // eslint
      "no-console": "warn",

      // import
      "import/no-cycle": "warn",
      "import/order": [
        "warn",
        {
          alphabetize: { caseInsensitive: true, order: "asc" },
          groups: ["builtin", "external", "internal"],
          "newlines-between": "never",
        },
      ],

      // sonarjs
      "sonarjs/no-duplicate-string": "off",
      "sonarjs/todo-tag": "warn",
      "sonarjs/fixme-tag": "warn",
      "sonarjs/no-commented-code": "warn",
      "sonarjs/jsx-no-constructed-context-values": "warn",
      "sonarjs/no-array-index-key": "warn",
      "sonarjs/no-redeclare": "off",
      "sonarjs/no-nested-functions": "warn",
      "sonarjs/sonar-no-unused-vars": "off",

      // duplicates of typescript-eslint rules (prefer typescript-eslint as their rule pages are clearer)
      "sonarjs/no-misused-promises": "off",
      "sonarjs/different-types-comparison": "off",
      "sonarjs/sonar-prefer-regexp-exec": "off",
      "sonarjs/sonar-prefer-optional-chain": "off",

      // to be enabled later
      "sonarjs/no-unstable-nested-components": "warn", // TODO: enable later

      // FIXME: fix/reevaluate
      "sonarjs/new-cap": "off",
      "sonarjs/deprecation": "off",
      "sonarjs/no-empty-test-file": "off",
      "sonarjs/function-return-type": "off",
      "sonarjs/no-alphabetical-sort": "off",
      "sonarjs/no-base-to-string": "off",
      "sonarjs/no-invalid-await": "off",
      "sonarjs/no-misleading-array-reverse": "off",
      "sonarjs/no-undefined-argument": "off",
      "sonarjs/sonar-prefer-read-only-props": "off",

      // typescript-eslint
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/consistent-type-imports": "warn",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],

      // to be enabled later
      "@typescript-eslint/ban-ts-comment": "off", // TODO: enable later
      "@typescript-eslint/consistent-type-definitions": "off", // TODO: enable later
      "@typescript-eslint/array-type": "off", // TODO: enable later

      // FIXME: fix/reevaluate
      "@typescript-eslint/no-base-to-string": "off",
      "@typescript-eslint/no-floating-promises": "off",
      "@typescript-eslint/no-unsafe-argument": "off",
      "@typescript-eslint/no-unsafe-member-access": "off",
      "@typescript-eslint/only-throw-error": "off",
      "@typescript-eslint/prefer-promise-reject-errors": "off",
      "@typescript-eslint/restrict-template-expressions": "off",
      "@typescript-eslint/require-await": "off",
      "@typescript-eslint/prefer-regexp-exec": "off",
      "@typescript-eslint/prefer-optional-chain": "off",
      "@typescript-eslint/no-unsafe-enum-comparison": "off",
      "@typescript-eslint/no-misused-promises": "off",
      "@typescript-eslint/dot-notation": "off",
      "@typescript-eslint/no-unsafe-call": "off",
      "@typescript-eslint/await-thenable": "off",
      "@typescript-eslint/no-unsafe-return": "off",
      "@typescript-eslint/no-unsafe-assignment": "off",
      "@typescript-eslint/non-nullable-type-assertion-style": "off",
      "@typescript-eslint/unbound-method": "off",
      "@typescript-eslint/prefer-nullish-coalescing": "off",
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
