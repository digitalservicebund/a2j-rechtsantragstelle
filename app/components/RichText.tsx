import { type Renderer, Marked } from "marked";
import { z } from "zod";
import sanitizeHtml from "sanitize-html";

export const RichTextPropsSchema = z.object({
  markdown: z.string(),
  className: z.string().optional(),
});

export type RichTextProps = z.infer<typeof RichTextPropsSchema>;

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
}: RichTextProps & {
  renderer?: Partial<Renderer>;
}) => {
  const marked = new Marked({
    renderer: renderer ?? defaultRenderer,
    async: false,
  });
  const html = marked.parse(markdown) as string;

  if (!html) return null;

  return (
    <div
      {...props}
      className={`rich-text ds-stack-8 ${className ?? ""}`}
      dangerouslySetInnerHTML={{
        __html: sanitizeHtml(html, {
          allowedClasses: {
            p: ["text-lg", "ds-subhead", "leading-snug"],
            a: ["text-link", "increase-tap-area", "whitespace-nowrap"],
            h: ["ds-heading-01-reg", "ds-label-01-bold", "ds-heading-02-reg"],
          },
        }),
      }}
    />
  );
};

export default RichText;
