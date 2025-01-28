import { Marked, Renderer } from "marked";
import { renderToString } from "react-dom/server";
import * as xssImport from "xss";
import { openInNewAllowedAttributes } from "~/components/OpenInNewTabIcon";
import { StandaloneLink } from "~/components/StandaloneLink";

// Note: type recast of import due to wrong default type export
const xss = xssImport.default as unknown as typeof xssImport;

const CSS_HEADING_CLASSES = [
  "ds-heading-01-reg",
  "ds-heading-02-reg",
  "ds-heading-03-reg",
  "ds-label-01-bold",
];

const allowList = {
  ...xss.getDefaultWhiteList(),
  a: xss.getDefaultWhiteList().a?.concat(["rel", "aria-label", "class"]),
  p: xss.getDefaultWhiteList().p?.concat(["class"]),
  h1: xss.getDefaultWhiteList().h1?.concat(["class"]),
  h2: xss.getDefaultWhiteList().h2?.concat(["class"]),
  h3: xss.getDefaultWhiteList().h3?.concat(["class"]),
  h4: xss.getDefaultWhiteList().h4?.concat(["class"]),
  h5: xss.getDefaultWhiteList().h5?.concat(["class"]),
  h6: xss.getDefaultWhiteList().h6?.concat(["class"]),
  ...openInNewAllowedAttributes,
};

const sanitizer = new xss.FilterXSS({ allowList, stripIgnoreTagBody: true });
export const sanitize = (html: string) => sanitizer.process(html);

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

export function parseAndSanitizeMarkdown(
  markdown: string,
  renderer: Partial<Renderer> = defaultRenderer,
) {
  const marked = new Marked({
    renderer,
    async: false,
  });
  marked.use({ hooks: { postprocess: postprocessHtml } });
  const htmlContent = marked.parse(markdown) as string;
  return sanitize(htmlContent);
}

export function postprocessHtml(html: string) {
  const listTagOpeningPattern = /<ul>|<ol>/g;
  const conditionalPattern = /{{\s*#|{{\s*\^/;
  const openingListTag = html.search(listTagOpeningPattern);
  const openingConditional = html.search(conditionalPattern);
  if (openingConditional !== -1 && openingListTag > openingConditional) {
    const listClosingTagPattern = /<\/ul>|<\/ol>/g;
    const listClosingTag = html.search(listClosingTagPattern);
    const openingTag = html.substring(openingListTag, openingListTag + 4);
    const endingTag = html.substring(listClosingTag, listClosingTag + 5);
    const htmlListTagsRemoved = html.replaceAll(/<ul>|<ol>|<\/ul>|<\/ol>/g, "");
    const final =
      htmlListTagsRemoved.substring(0, openingConditional) +
      openingTag +
      htmlListTagsRemoved.substring(openingConditional) +
      endingTag;
    return final;
  }
  return html;
}
