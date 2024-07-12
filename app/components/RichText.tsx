import { type Renderer, Marked } from "marked";
import sanitizeHtml from "sanitize-html";
import { z } from "zod";
import { isExternalUrl } from "~/util/isExternalUrl";
import {
  openInNewAllowedAttributes,
  openInNewAllowedTags,
  openInNewIconText,
} from "./openInNewTabIcon";

export const RichTextPropsSchema = z.object({
  markdown: z.string(),
  className: z.string().optional(),
});

export type RichTextProps = z.infer<typeof RichTextPropsSchema>;

const allowedTags =
  sanitizeHtml.defaults.allowedTags.concat(openInNewAllowedTags);
const allowedAttributes = {
  a: sanitizeHtml.defaults.allowedAttributes["a"].concat(["rel"]),
  ...openInNewAllowedAttributes,
};

const defaultRenderer: Partial<Renderer> = {
  link({ href, text }) {
    const isExternal = isExternalUrl(href);
    return `<a href="${href}" class="text-link" ${isExternal ? 'target="_blank" rel="noopener noreferrer"' : ""}>${text}${isExternal ? openInNewIconText : ""}</a>`;
  },
  heading({ depth, text }) {
    const cssClass =
      ["ds-heading-01-reg", "ds-heading-02-reg"].at(depth - 1) ??
      "ds-label-01-bold";
    return `<h${depth} class="${cssClass}">${text}</h${depth}>`;
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
          allowedTags,
          allowedClasses: {
            p: ["ds-subhead", "max-w-full"],
            a: ["text-link"],
            h: ["ds-heading-01-reg", "ds-label-01-bold", "ds-heading-02-reg"],
          },
          allowedAttributes,
        }),
      }}
    />
  );
};

export default RichText;
