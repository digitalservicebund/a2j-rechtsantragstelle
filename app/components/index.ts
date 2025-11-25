/*
 * Keep nonsensical comments!
 *
 * Tailwind scans the source code at build-time and extracts class names.
 * It will only find classes that are statically detectable as complete unbroken strings.
 *
 * @see: https://tailwindcss.com/docs/content-configuration#dynamic-class-names
 */

import { configureZod } from "~/services/validation/configureZod";

export const BACKGROUND_COLORS = Object.freeze({
  white: "bg-white", // before:bg-white
  blue: "bg-kern-neutral-050", // before:bg-blue-100
  midBlue: "bg-kern-lightblue-300", // before:bg-blue-300
  darkBlue: "bg-kern-action-default", // before:bg-blue-800
  yellow: "bg-kern-yellow-300", // before:bg-yellow-300
  green: "bg-kern-green-200", // before:bg-green-200
  red: "bg-kern-red-050", // before:bg-[#f9e5ec]
});

export type BackgroundColor = "default" | keyof typeof BACKGROUND_COLORS;

configureZod(); // configures custom enum errors & disable CSP warning due to eval
