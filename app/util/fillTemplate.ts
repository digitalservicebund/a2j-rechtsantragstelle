import mustache from "mustache";

export type Replacements = Record<string, string | boolean | undefined>;

type FillTemplateOpts = {
  template: string;
  replacements?: Replacements;
};

export const fillTemplate = ({ template, replacements }: FillTemplateOpts) =>
  replacements ? mustache.render(template, replacements) : template;

export function interpolateDeep<T>(input: T, replacements?: Replacements) {
  if (!replacements) return input;
  return JSON.parse(
    fillTemplate({
      template: JSON.stringify(input),
      replacements,
    }),
  ) as T;
}

/**
 * Helper function like interpolateDeep, but explicitly for flow types.
 * Separated from interpolateDeep for better performance (only run recursive function for flows)
 * @param flow desired flow to interpolate
 * @param replacements string replacements
 * @returns flow with correct strings
 */
export function interpolateFlowDeep<T extends Record<string, any>>(
  flow: T,
  replacements?: Replacements,
) {
  if (!replacements) return flow;
  if (hasFunction(flow)) {
    throw new Error("Cannot interpolate functions in a flow");
  }
  return JSON.parse(
    fillTemplate({
      template: JSON.stringify(flow),
      replacements,
    }),
  ) as T;
}

/**
  Recursive helper function to determine if a deeply-nested object contains functions
 */
export function hasFunction(obj: Record<string, any>): boolean {
  // Loop through all properties of the object
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const value = obj[key];

      // Check if the value is a function
      if (typeof value === "function") {
        return true; // Function found, return immediately
      }

      // If the value is an object, recurse into it
      if (typeof value === "object" && value !== null) {
        if (hasFunction(value)) {
          return true; // If a function is found deeper in the object, return true
        }
      }
    }
  }

  return false; // No function found after traversing all properties
}
