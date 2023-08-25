import { type Renderer, Marked } from "marked";
import { z } from "zod";

export const RichTextPropsSchema = z.object({
  markdown: z.string(),
  className: z.string().optional(),
});

type RichTextProps = z.infer<typeof RichTextPropsSchema> & {
  renderer?: Partial<Renderer>;
};

const defaultRenderer: Partial<Renderer> = {
  link(href: string, title: string, text: string) {
    const cssClass = "text-link";
    if (href.includes("ext:")) {
      const newHref = href.replace("ext:", "");
      return `<a href="${newHref}" class="${cssClass}" target="_blank" rel="noopener">${text}</a>`;
    }
    return `<a href="${href}" class="${cssClass}">${text}</a>`;
  },
  heading(text: string, level: number) {
    const cssClass =
      ["ds-heading-01-reg", "ds-heading-02-reg"].at(level - 1) ??
      "ds-label-01-bold";
    return `<h${level} class="${cssClass}">${text}</h${level}>`;
  },
  paragraph(text: string) {
    return `<p class="text-lg">${text}</p>`;
  },
} as const;

const RichText = ({
  markdown,
  renderer,
  className,
  ...props
}: RichTextProps) => {
  const marked = new Marked({ renderer: renderer ?? defaultRenderer });
  const html = marked.parse(markdown);

  if (!html) return null;

  return (
    <div
      {...props}
      className={`rich-text ds-stack-8 ${className ?? ""}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

export default RichText;
