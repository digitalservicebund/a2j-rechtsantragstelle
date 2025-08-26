import vitest from "@vitest/eslint-plugin";
import { FlatCompat } from "@eslint/eslintrc";
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
  {
    rules: {
      "constructor-super": "error",
      "getter-return": "error",
      "no-dupe-args": "error",
      "no-misleading-character-class": "error",
      "no-octal": "error",
      "no-undef": "error",
      "no-unreachable": "error",
    },
  },
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
      {
        rules: {
          "react/display-name": "error",
          "react/jsx-uses-react": "error",
          "react/jsx-uses-vars": "error",
          "react/no-unsafe": "off",
          "react/prop-types": "error",
          "react/require-render-return": "error",
        },
      },
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
      "react/jsx-no-constructed-context-values": "warn",
      "react/no-array-index-key": "warn",
      "react/no-unstable-nested-components": "warn",
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
      "import/no-cycle": "off", // VERY slow, only enable if needed
      "import/namespace": "off", // slow and unneeded
      "import/no-unused-modules": [
        "off", // slow but useful to find unused exports. you might need to create an empty .eslintrc file, see https://github.com/import-js/eslint-plugin-import/issues/3079
        {
          unusedExports: true,
          ignoreExports: ["app/routes/"],
        },
      ],
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
      "sonarjs/todo-tag": "off",
      "sonarjs/function-return-type": "off",
      "sonarjs/aws-restricted-ip-admin-access": "off", // slow and unneeded
      "sonarjs/no-async-constructor": "off", // slow and unneeded
      // duplicates of typescript-eslint rules (prefer typescript-eslint as their rule pages are clearer)
      "sonarjs/sonar-no-unused-vars": "off",
      "sonarjs/no-misused-promises": "off",
      "sonarjs/different-types-comparison": "off",
      "sonarjs/sonar-prefer-regexp-exec": "off",
      "sonarjs/sonar-prefer-optional-chain": "off",
      "sonarjs/no-dead-store": "off",
      "sonarjs/anchor-has-content": "off",
      "sonarjs/no-invalid-await": "off",

      // typescript-eslint
      "@typescript-eslint/consistent-type-imports": [
        "warn",
        { fixStyle: "inline-type-imports" },
      ],
      "@typescript-eslint/only-throw-error": "off", // disabled, as remix/react-router can throw redirects
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/consistent-type-definitions": ["warn", "type"],
      "@typescript-eslint/array-type": ["warn", { default: "array-simple" }],

      // enable gradually for full type safety
      "@typescript-eslint/no-unsafe-argument": "off",
      "@typescript-eslint/no-unsafe-member-access": "off",
      "@typescript-eslint/no-unsafe-call": "off",
      "@typescript-eslint/no-unsafe-return": "off",
      "@typescript-eslint/no-unsafe-assignment": "off",
      "@typescript-eslint/prefer-nullish-coalescing": "warn",
      // TODO: Align both streams for enabling exhaustiveness check globally
      "@typescript-eslint/switch-exhaustiveness-check": "warn",
      "no-restricted-syntax": [
        "error",
        {
          selector:
            "Literal[value=/(a\u0308)|(o\u0308)|(u\u0308)|(A\u0308)|(O\u0308)|(U\u0308)/]",
          message:
            "German umlauts must be written as NFC (normalized form canonical composition) and not NFD (normalized form canonical decomposition). E.g. use 'ä' instead of the character 'a' followed by the combining diacritical marks ' ̈'.",
        },
        "error",
        {
          selector: "TSEnumDeclaration",
          message: "Do not declare enums",
        },
      ],
    },
  },
  // AutoSuggest specific rules
  {
    files: ["**/autoSuggestInput/*.{ts,tsx}"],
    rules: {
      "@typescript-eslint/switch-exhaustiveness-check": "error",
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
      "@typescript-eslint/unbound-method": "off",
      "require-await": "error",
    },
  },
);
