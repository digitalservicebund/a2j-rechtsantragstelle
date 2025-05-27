import { type CheckboxValue } from "~/components/inputs/Checkbox";

export function checkboxListToString(
  mapping: Record<string, string>,
  options?: Record<string, CheckboxValue>,
) {
  if (!options) return "";

  return Object.entries(options)
    .filter(([key, value]) => key in mapping && value === "on")
    .map(([key]) => mapping[key])
    .join(", ");
}
