/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  presets: [require("@digitalservice4germany/style-dictionary/tailwind")],
  theme: {
    extend: {},
  },
  corePlugins: {
    container: false,
  },
  plugins: [require("@digitalservice4germany/angie")],
};
