import { type Renderer, Marked } from "marked";
import ReactDOMServer from "react-dom/server";
import sanitizeHtml from "sanitize-html";
import { z } from "zod";
import {
  openInNewAllowedAttributes,
  openInNewAllowedTags,
} from "./OpenInNewTabIcon";
import { StandaloneLink } from "./StandaloneLink";

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
    /* Either renders a Standalone link or Inline link, 
      but we use the StandaloneLink component, because both has the same structure and style */
    return ReactDOMServer.renderToString(
      <StandaloneLink text={text} url={href} />,
    );
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
