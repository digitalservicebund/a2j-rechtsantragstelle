export { default as Button } from "./Button";
export { default as InputError } from "./InputError";
export { default as InputLabel } from "./InputLabel";
export { default as Input } from "./Input";
export { default as Radio } from "./Radio";
export { default as RadioGroup } from "./RadioGroup";
export { default as Select } from "./Select";
export { default as Box } from "./Box";
export { default as Background } from "./Background";
export { default as Container } from "./Container";

/*
 * Keep nonsensical comments!
 *
 * Tailwind scans the source code at build-time and extracts class names.
 * It will only find classes that are statically detectable as complete unbroken strings.
 *
 * @see: https://tailwindcss.com/docs/content-configuration#dynamic-class-names
 */

export const BACKGROUND_COLORS = Object.freeze({
  white: "bg-white", // before:bg-white
  blue: "bg-blue-100", // before:bg-blue-100
  yellow: "bg-yellow-300", // before:bg-yellow-300
  green: "bg-green-200", // before:bg-green-200
  red: "bg-[#f9e5ec]", // before:bg-[#f9e5ec]
});

export type BackgroundColor = "default" | keyof typeof BACKGROUND_COLORS;

export type CommonWrapperProps = {
  backgroundColor?: BackgroundColor;
  paddingTop?:
    | "default"
    | "0" // !pt-0
    | "8" // !pt-8
    | "16" // !pt-16
    | "24" // !pt-24
    | "32" // !pt-32
    | "40" // !pt-40
    | "48" // !pt-48
    | "56" // !pt-56
    | "64"; // !pt-64
  paddingBottom?:
    | "default"
    | "0" // !pb-0
    | "8" // !pb-8
    | "16" // !pb-16
    | "24" // !pb-24
    | "32" // !pb-32
    | "40" // !pb-40
    | "48" // !pb-48
    | "56" // !pb-56
    | "64"; // !pb-64
};
