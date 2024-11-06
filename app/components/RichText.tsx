import { type Renderer, Marked } from "marked";
import { renderToString } from "react-dom/server";
import { z } from "zod";
import { sanatize } from "~/services/security/sanatizeHtml";
import { StandaloneLink } from "./StandaloneLink";

export const RichTextPropsSchema = z.object({
  markdown: z.string(),
  className: z.string().optional(),
});

const CSS_HEADING_CLASSES = [
  "ds-heading-01-reg",
  "ds-heading-02-reg",
  "ds-heading-03-reg",
  "ds-label-01-bold",
];

export type RichTextProps = z.infer<typeof RichTextPropsSchema>;

const defaultRenderer: Partial<Renderer> = {
  link({ href, text }) {
    /* Either renders a Standalone link or Inline link,
      but we use the StandaloneLink component, because both has the same structure and style */
    return renderToString(<StandaloneLink text={text} url={href} />);
  },
  heading({ depth, text }) {
    // can't use .at() due to old browsers
    const cssClass = CSS_HEADING_CLASSES[depth - 1] ?? "ds-label-01-reg";
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
      dangerouslySetInnerHTML={{ __html: sanatize(html) }}
    />
  );
};

export default RichText;
