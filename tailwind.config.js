/** @type {import('tailwindcss').Config} */
const plugin = require("tailwindcss/plugin");

module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  presets: [require("@digitalservice4germany/style-dictionary/tailwind")],
  theme: {
    extend: {},
  },
  corePlugins: {
    container: false,
  },
  plugins: [
    require("@digitalservice4germany/angie"),
    /* Experimental workaround for old Safaris not supporting "gap" together with flexbox */
    /* TODO: consider moving this to angie when it works well */
    plugin(function ({ addUtilities, matchUtilities, theme }) {
      addUtilities(
        {
          "[class*=ds-gap]": {
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
          },
          "[class*=ds-gap] > *": { marginLeft: "0" },
          "[class*=ds-gap] > * + *": {
            marginLeft: "var(--ds-gap-space)",
          },
        },
        ["responsive"],
      );

      matchUtilities(
        {
          "ds-gap": (value) => ({
            "--ds-gap-space": value,
          }),
        },
        {
          values: theme("spacing"),
        },
      );
    }),
  ],
};
