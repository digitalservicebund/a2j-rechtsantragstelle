import { Marked, type Renderer } from "marked";
import { renderToString } from "react-dom/server";
import { StandaloneLink } from "~/components/StandaloneLink";
import { sanitizeHtml } from "./sanitizeHtml";

const CSS_HEADING_CLASSES = [
  "ds-heading-01-reg",
  "ds-heading-02-reg",
  "ds-heading-03-reg",
  "ds-label-01-bold",
];

export const defaultRenderer: Partial<Renderer> = {
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

// TODO: refactor to split into markdown service
export function parseAndSanitizeMarkdown(
  markdown: string,
  renderer?: Partial<Renderer>,
) {
  // in case the render is provided, we merge it with the default renderer so it can be used in the markdown parser
  const defaultRendererWithMarkdown = renderer
    ? { ...defaultRenderer, ...renderer }
    : defaultRenderer;

  const marked = new Marked({
    renderer: defaultRendererWithMarkdown,
    async: false,
  });
  marked.use({ hooks: { postprocess: handleNestedLists } });
  const htmlContent = marked.parse(markdown) as string;
  return sanitizeHtml(htmlContent);
}

/**
 * If a user defines the first element of a list inside a conditional like so:
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
 *
 * This function iteratively walks through the input html, swapping the order of opening list tags and opening conditionals.
 */
export function handleNestedLists(html: string) {
  const nestedLists = [
    ...html.matchAll(/{{\s*[#|^]\w+\s*}}(?=.*\n*(<ul>|<ol>))/g),
  ];
  if (nestedLists.length > 0 && !contentExistsBeforeList(html)) {
    let fixedMarkup = html;
    for (const nestedList of nestedLists) {
      const openingTag = [...fixedMarkup.matchAll(/<ul>|<ol>/g)].find(
        (tag) => tag.index > nestedList.index,
      )!;
      fixedMarkup =
        fixedMarkup.substring(0, nestedList.index) +
        openingTag[0] +
        fixedMarkup.substring(nestedList.index).replace(openingTag[0], "");
    }
    return fixedMarkup;
  }
  return html;
}

/**
 * An exception to the above handling is when a list is inside a conditonal, but there
 * is content that comes before the start of the list, e.g.
 *
 * {{ #variable }}
 * Please add the following things:
 * * Thing 1
 * * Thing 2
 * {{ /variable }}
 *
 * In this case, we need to fall back to the default handling and show/hide it all.
 */
export function contentExistsBeforeList(html: string) {
  const strippedContentString = html.replaceAll(/(<\/*p+>)|\s+/g, "");
  const openingTagPosition = strippedContentString.search(/<ul>|<ol>/);
  const beforeOpeningTag = strippedContentString.substring(
    openingTagPosition - 2,
    openingTagPosition,
  );
  return beforeOpeningTag !== "}}";
}
