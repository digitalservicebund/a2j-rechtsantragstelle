/*
 * Keep nonsensical comments!
 *
 * Tailwind scans the source code at build-time and extracts class names.
 * It will only find classes that are statically detectable as complete unbroken strings.
 *
 * @see: https://tailwindcss.com/docs/content-configuration#dynamic-class-names
 */

import { z } from "zod";

export const BACKGROUND_COLORS = Object.freeze({
  white: "bg-white", // before:bg-white
  blue: "bg-blue-100", // before:bg-blue-100
  midBlue: "bg-blue-300", // before:bg-blue-300
  darkBlue: "bg-blue-800", // before:bg-blue-800
  yellow: "bg-yellow-300", // before:bg-yellow-300
  green: "bg-green-200", // before:bg-green-200
  red: "bg-[#f9e5ec]", // before:bg-[#f9e5ec]
});

export type BackgroundColor = "default" | keyof typeof BACKGROUND_COLORS;

export const ErrorMessagePropsSchema = z.object({
  code: z.string(),
  text: z.string(),
});
