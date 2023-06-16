import mustache from "mustache";

type FillTemplateOpts = {
  template: string;
  replacements?: Record<string, string>;
};

export const fillTemplate = (opts: FillTemplateOpts) =>
  mustache.render(opts.template, opts.replacements ?? {});
