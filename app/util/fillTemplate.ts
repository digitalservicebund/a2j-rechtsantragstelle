import mustache from "mustache";

export type Replacements = Record<string, string | boolean | undefined>;

type FillTemplateOpts = {
  template: string;
  replacements?: Replacements;
};

export const fillTemplate = ({ template, replacements }: FillTemplateOpts) =>
  replacements ? mustache.render(template, replacements) : template;

export function interpolateSerializableObject<T>(
  input: T,
  replacements?: Replacements,
) {
  if (!replacements) return input;
  // Note: JSON.stringiy will remove any non-serializable properties such as functions
  return JSON.parse(
    fillTemplate({
      template: JSON.stringify(input),
      replacements,
    }),
    throwIfFunction,
  ) as T;
}

export function recursivelyReplaceStrings(
  content: unknown,
  stringReplacements?: Replacements,
): unknown {
  if (!stringReplacements || !content) return content;
  if (typeof content === "string") {
    return mustache.render(content, stringReplacements);
  }

  // Need to filter out content that shouldn't be visible
  if (
    typeof content === "object" &&
    "isVisible" in content &&
    typeof content.isVisible === "string" &&
    mustache.render(content.isVisible, stringReplacements) === "false"
  ) {
    return undefined;
  }

  if (Array.isArray(content)) {
    return content
      .map((item) => recursivelyReplaceStrings(item, stringReplacements))
      .filter((item) => item !== undefined);
  }

  return Object.fromEntries(
    Object.entries(content)
      .map(([key, value]) => [
        key,
        recursivelyReplaceStrings(value, stringReplacements),
      ])
      .filter(([, value]) => value !== undefined),
  );
}

export const throwIfFunction = (key: string, val: unknown) => {
  if (typeof val === "function")
    throw Error(`key ${key} is a function and can't be serialized`);
  return val;
};
