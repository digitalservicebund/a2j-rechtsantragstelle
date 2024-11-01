import vitest from "@vitest/eslint-plugin";

export default [
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
