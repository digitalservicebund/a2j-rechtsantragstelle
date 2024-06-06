// based on https://github.com/remix-run/indie-stack/blob/main/.eslintrc.js

/** @type {import('eslint').Linter.Config} */
module.exports = {
  ignorePatterns: ["/*", "!/app", "!/tests", "*.generated.ts"],
  root: true,
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
    },
  },
  env: {
    browser: true,
    commonjs: true,
    es6: true,
  },

  // Base config
  extends: ["eslint:recommended"],

  overrides: [
    // React
    {
      files: ["**/*.{js,jsx,ts,tsx}"],
      plugins: ["react", "jsx-a11y"],
      extends: [
        "plugin:react/recommended",
        "plugin:react/jsx-runtime",
        "plugin:react-hooks/recommended",
        "plugin:jsx-a11y/recommended",
      ],
      settings: {
        react: {
          version: "detect",
        },
        formComponents: ["Form"],
        linkComponents: [
          { name: "Link", linkAttribute: "to" },
          { name: "NavLink", linkAttribute: "to" },
        ],
      },
      rules: {
        "react/jsx-no-leaked-render": ["off", { validStrategies: ["ternary"] }], // enable later
      },
    },

    // Typescript
    {
      files: ["**/*.{ts,tsx}"],
      plugins: ["@typescript-eslint", "import", "sonarjs"],
      parser: "@typescript-eslint/parser",
      settings: {
        "import/internal-regex": "^~/",
        "import/resolver": {
          node: { extensions: [".ts", ".tsx"] },
          typescript: { alwaysTryTypes: true },
        },
      },
      extends: [
        "plugin:@typescript-eslint/recommended",
        "plugin:@typescript-eslint/stylistic",
        "plugin:import/recommended",
        "plugin:import/typescript",
        "plugin:sonarjs/recommended-legacy",
      ],
      rules: {
        "no-console": "warn",
        "sonarjs/no-duplicate-string": "off",
        "@typescript-eslint/ban-ts-comment": "off", // enable later
        "@typescript-eslint/consistent-type-definitions": "off", // enable later
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

    // Jest/Vitest
    {
      files: ["tests/**/*.test.{js,jsx,ts,tsx}"],
      plugins: ["jest", "jest-dom"],
      extends: ["plugin:jest/recommended", "plugin:jest-dom/recommended"],
      env: { "jest/globals": true },
      rules: {
        "jest/valid-title": "off", // enable later
        "jest/no-standalone-expect": "off", // enable later
      },
    },

    // Node
    {
      files: [".eslintrc.js", "mocks/**/*.js"],
      env: {
        node: true,
      },
    },
  ],
};
