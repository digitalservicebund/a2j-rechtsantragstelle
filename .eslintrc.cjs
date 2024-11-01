module.exports = {
  overrides: [
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

    // Node TODO: (Not sure if needed?)
    // {
    //   files: [".eslintrc.js", "mocks/**/*.js"],
    //   env: {
    //     node: true,
    //   },
    // },
  ],
};
