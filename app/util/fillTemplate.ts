import mustache from "mustache";

export type Replacements = Record<string, string>;

type FillTemplateOpts = {
  template: string;
  replacements?: Replacements;
};

export const fillTemplate = (opts: FillTemplateOpts) =>
  mustache.render(opts.template, opts.replacements ?? {});
