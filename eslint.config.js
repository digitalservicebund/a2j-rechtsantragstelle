import vitest from "@vitest/eslint-plugin";
import globals from "globals";
import react from "eslint-plugin-react";
import jsxA11y from "eslint-plugin-jsx-a11y";
import importPlugin from "eslint-plugin-import";
import tseslint from "typescript-eslint";
import sonarjs from "eslint-plugin-sonarjs";

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
      {
        rules: {
          "jsx-a11y/alt-text": "error",
          "jsx-a11y/anchor-ambiguous-text": "off",
          // TODO: error
          "jsx-a11y/anchor-has-content": "error",
          "jsx-a11y/anchor-is-valid": "error",
          "jsx-a11y/aria-activedescendant-has-tabindex": "error",
          "jsx-a11y/aria-props": "error",
          "jsx-a11y/aria-proptypes": "error",
          "jsx-a11y/aria-role": "error",
          "jsx-a11y/aria-unsupported-elements": "error",
          "jsx-a11y/autocomplete-valid": "error",
          "jsx-a11y/click-events-have-key-events": "error",
          "jsx-a11y/control-has-associated-label": [
            "off",
            {
              ignoreElements: [
                "audio",
                "canvas",
                "embed",
                "input",
                "textarea",
                "tr",
                "video",
              ],
              ignoreRoles: [
                "grid",
                "listbox",
                "menu",
                "menubar",
                "radiogroup",
                "row",
                "tablist",
                "toolbar",
                "tree",
                "treegrid",
              ],
              includeRoles: ["alert", "dialog"],
            },
          ],
          "jsx-a11y/heading-has-content": "error",
          "jsx-a11y/html-has-lang": "error",
          "jsx-a11y/iframe-has-title": "error",
          "jsx-a11y/img-redundant-alt": "error",
          "jsx-a11y/interactive-supports-focus": [
            "error",
            {
              tabbable: [
                "button",
                "checkbox",
                "link",
                "searchbox",
                "spinbutton",
                "switch",
                "textbox",
              ],
            },
          ],
          "jsx-a11y/label-has-associated-control": "error",
          "jsx-a11y/label-has-for": "off",
          "jsx-a11y/media-has-caption": "error",
          "jsx-a11y/mouse-events-have-key-events": "error",
          "jsx-a11y/no-access-key": "error",
          "jsx-a11y/no-autofocus": "error",
          "jsx-a11y/no-distracting-elements": "error",
          "jsx-a11y/no-interactive-element-to-noninteractive-role": [
            "error",
            {
              tr: ["none", "presentation"],
              canvas: ["img"],
            },
          ],
          "jsx-a11y/no-noninteractive-element-interactions": [
            "error",
            {
              handlers: [
                "onClick",
                "onError",
                "onLoad",
                "onMouseDown",
                "onMouseUp",
                "onKeyPress",
                "onKeyDown",
                "onKeyUp",
              ],
              alert: ["onKeyUp", "onKeyDown", "onKeyPress"],
              body: ["onError", "onLoad"],
              dialog: ["onKeyUp", "onKeyDown", "onKeyPress"],
              iframe: ["onError", "onLoad"],
              img: ["onError", "onLoad"],
            },
          ],
          "jsx-a11y/no-noninteractive-element-to-interactive-role": [
            "error",
            {
              ul: [
                "listbox",
                "menu",
                "menubar",
                "radiogroup",
                "tablist",
                "tree",
                "treegrid",
              ],
              ol: [
                "listbox",
                "menu",
                "menubar",
                "radiogroup",
                "tablist",
                "tree",
                "treegrid",
              ],
              li: [
                "menuitem",
                "menuitemradio",
                "menuitemcheckbox",
                "option",
                "row",
                "tab",
                "treeitem",
              ],
              table: ["grid"],
              td: ["gridcell"],
              fieldset: ["radiogroup", "presentation"],
            },
          ],
          "jsx-a11y/no-noninteractive-tabindex": [
            "error",
            {
              tags: [],
              roles: ["tabpanel"],
              allowExpressionValues: true,
            },
          ],
          "jsx-a11y/no-redundant-roles": "error",
          "jsx-a11y/no-static-element-interactions": [
            "error",
            {
              allowExpressionValues: true,
              handlers: [
                "onClick",
                "onMouseDown",
                "onMouseUp",
                "onKeyPress",
                "onKeyDown",
                "onKeyUp",
              ],
            },
          ],
          "jsx-a11y/role-has-required-aria-props": "error",
          "jsx-a11y/role-supports-aria-props": "error",
          "jsx-a11y/scope": "error",
          "jsx-a11y/tabindex-no-positive": "error",
        },
      },
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
