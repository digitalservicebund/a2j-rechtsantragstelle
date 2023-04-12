const plugin = require("tailwindcss/plugin");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  presets: [require("@digitalservice4germany/style-dictionary/tailwind")],
  theme: {
    extend: {},
  },
  corePlugins: {
    preflight: false,
    container: false,
  },
  plugins: [
    plugin(function ({ matchUtilities, theme }) {
      matchUtilities(
        {
          stack: (value) => ({
            "--stack-space": value,
          }),
        },
        {
          values: theme("spacing"),
        }
      );
    }),
  ],
};
