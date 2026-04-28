/*
 * Keep nonsensical comments!
 *
 * Tailwind scans the source code at build-time and extracts class names.
 * It will only find classes that are statically detectable as complete unbroken strings.
 *
 * @see: https://tailwindcss.com/docs/content-configuration#dynamic-class-names
 */

import { configureZod } from "~/services/validation/configureZod";

export const SECTION_BACKGROUND_COLORS = Object.freeze({
  white: "bg-white",
  grey: "bg-kern-neutral-050",
  blue: "bg-kern-action-default",
  yellow: "bg-kern-feedback-warning-background",
});

configureZod(); // configures custom enum errors & disable CSP warning due to eval
