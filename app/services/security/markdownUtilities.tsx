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

// Mustache template placeholders
export const PLACEHOLDER_REGEX = /^\{{2,3}[a-zA-Z0-9._-]+\}{2,3}$/;

const sanitizer = new xss.FilterXSS({
  allowList,
  stripIgnoreTagBody: true,
  onTagAttr: (tag, name, value) => {
    // Allow hrefs that use template placeholders like {{courtWebsite}} or {{{courtWebsite}}}
    const ahref = tag === "a" && name === "href";
    if (ahref && PLACEHOLDER_REGEX.test(value)) {
      return `${name}="${value}"`;
    }
  },
});
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
  marked.use({ hooks: { postprocess: handleNestedLists } });
  const htmlContent = marked.parse(markdown) as string;
  return sanitize(htmlContent);
}

/**
 * Sometimes, it's possible for a list to be nested inside a conditional, like so:
 *
 * {{ #conditional }}
 * * Item 1
 * {{ /conditional }}
 * * Item 2
 *
 * Marked then converts this to:
 * {{ #conditional }}
 * <ul>
 * <li>Item 1</li>
 * {{ /conditional }}
 * <li>Item 2</li>
 * </ul>
 *
 * and if "conditional" evaluates to false, the templating engine (mustache) will remove Item 1, as well as
 * the opening <ul> tag, leaving incomplete html that's inaccessible.
 */
export function handleNestedLists(html: string) {
  const openingTagPosition = html.search(/<ul>|<ol>/);
  const conditionalPosition = html.search(/{{\s*#|{{\s*\^/);
  // if there's an opening list tag after a conditional, we need to correctly un-nest the list tags.
  if (conditionalPosition !== -1 && openingTagPosition > conditionalPosition) {
    const closingTagPosition = html.search(/<\/ul>|<\/ol>/);
    const openingTag = html.substring(
      openingTagPosition,
      openingTagPosition + 4,
    );
    const closingTag = html.substring(
      closingTagPosition,
      closingTagPosition + 5,
    );
    const htmlListTagsRemoved = html.replaceAll(/<ul>|<ol>|<\/ul>|<\/ol>/g, "");
    const final =
      htmlListTagsRemoved.substring(0, conditionalPosition) +
      openingTag +
      htmlListTagsRemoved.substring(conditionalPosition) +
      closingTag;
    return final;
  }
  return html;
}
