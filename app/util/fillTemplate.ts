import mustache from "mustache";

type Replacements = Record<string, string | undefined>;

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
