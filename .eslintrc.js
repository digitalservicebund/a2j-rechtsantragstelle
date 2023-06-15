/** @type {import('eslint').Linter.Config} */
module.exports = {
  extends: [
    "@remix-run/eslint-config",
    "@remix-run/eslint-config/node",
    "plugin:sonarjs/recommended",
  ],
  plugins: ["sonarjs"],
  rules: {
    "sonarjs/no-duplicate-string": "warn",
    "sonarjs/no-small-switch": "warn",
    camelcase: ["error", { properties: "always", allow: ["^v2_", "^V2_"] }],
  },
};
