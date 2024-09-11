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

export const throwIfFunction = (key: string, val: unknown) => {
  if (typeof val === "function")
    throw Error(`key ${key} is a function and can't be serialized`);
  return val;
};
