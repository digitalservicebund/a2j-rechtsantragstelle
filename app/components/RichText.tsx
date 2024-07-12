import { type Renderer, Marked } from "marked";
import sanitizeHtml from "sanitize-html";
import { z } from "zod";
import { isExternalUrl } from "~/util/isExternalUrl";

export const RichTextPropsSchema = z.object({
  markdown: z.string(),
  className: z.string().optional(),
});

export type RichTextProps = z.infer<typeof RichTextPropsSchema>;

const defaultRenderer: Partial<Renderer> = {
  link({ href, text }) {
    const cssClass = "text-link";
    const hrefClean = href.replace("ext:", "");
    const isExternalLink = isExternalUrl(hrefClean);
    return `<a href="${hrefClean}" class="${cssClass}" ${isExternalLink ? 'target="_blank" rel="noopener noreferrer"' : ""}>${text}</a>`;
  },
  heading({ depth, text }) {
    const cssClass =
      ["ds-heading-01-reg", "ds-heading-02-reg"].at(depth - 1) ??
      "ds-label-01-bold";
    return `<h${depth} class="${cssClass}">${text}</h${depth}>`;
  },
  paragraph({ tokens }) {
    //TODO: design specifies ds-body-01-reg, which would descrease font-size to 16px
    return `<p class="text-lg">${this.parser?.parseInline(tokens)}</p>`;
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
    useNewRenderer: true,
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
            p: ["text-lg", "ds-subhead", "leading-snug", "max-w-full"],
            a: ["text-link", "increase-tap-area", "whitespace-nowrap"],
            h: ["ds-heading-01-reg", "ds-label-01-bold", "ds-heading-02-reg"],
          },
        }),
      }}
    />
  );
};

export default RichText;
