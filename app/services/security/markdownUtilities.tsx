import { Marked, type Renderer } from "marked";
import parse from "html-react-parser";
import {
  Children,
  cloneElement,
  isValidElement,
  type ReactElement,
  type ReactNode,
} from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { sanitizeHtml } from "./sanitizeHtml";
import { Icon } from "~/components/common/Icon";
import { isExternalUrl, isFileDownloadUrl } from "~/util/url";
import classNames from "classnames";
import { mustachePlaceholderRegex } from "./mustachePlaceholder";
import { translations } from "~/services/translations/translations";

const defaultRenderer: Partial<Renderer> = {
  link({ href: url = "", text }) {
    const shouldOpenNewTab =
      isExternalUrl(url) ||
      mustachePlaceholderRegex.test(url) ||
      isFileDownloadUrl(url);

    const anchorProps: React.AnchorHTMLAttributes<HTMLAnchorElement> = {
      href: url,
      className: classNames("kern-link inline-block! p-0!", {
        "no-underline! hover:underline!": shouldOpenNewTab,
      }),
      ...(shouldOpenNewTab
        ? {
            "aria-label": `${text}, ${translations.navigation.linkOpensNewTab.de}`,
            target: "_blank",
            rel: "noopener noreferrer",
          }
        : {}),
    };

    return renderToStaticMarkup(
      <a {...anchorProps}>
        {shouldOpenNewTab && (
          <Icon
            name="open-in-new"
            className="size-[1em] mb-[3.5px]! inline! mr-4"
          />
        )}
        {text}
      </a>,
    );
  },
};

// TODO: refactor to split into markdown service
export function parseAndSanitizeMarkdown(
  markdown: string,
  renderer?: Partial<Renderer>,
) {
  // in case the render is provided, we merge it with the default renderer so it can be used in the markdown parser
  const rendererWithMarkdown = { ...defaultRenderer, ...renderer };

  const marked = new Marked({
    renderer: rendererWithMarkdown,
    async: false,
  });
  marked.use({ hooks: { postprocess: handleNestedLists } });
  const htmlContent = marked.parse(markdown) as string;
  return removeEmptyTags(sanitizeHtml(htmlContent));
}

const voidElements = new Set([
  "area",
  "base",
  "br",
  "col",
  "embed",
  "hr",
  "img",
  "input",
  "link",
  "meta",
  "param",
  "source",
  "track",
  "wbr",
]);

/**
 * After string replacement (i.e. evaluation of conditions), we cannot guarantee
 * that the markup will be syntactically correct, and free of empty tags. For example, if you have something like
 *
 * <p><ul>{{#hasErhoehungsbetrag}}</p>
 * <li>Sie leisten Unterhalt an Ihren Partner bzw. Ihre Partnerin bzw. fürs Kind
 * {{/hasErhoehungsbetrag}}</li></ul>
 *
 * when hasErhoehungsbetrag is false, you'll end up with
 *
 * <p><ul></li></ul>
 *
 * and while the browser automatically corrects this markup to be syntactically correct, it leaves empty tags everywhere,
 * which messes up both the styling and accessibility of the page.
 */
function pruneEmptyNodes(node: ReactNode): ReactNode {
  if (typeof node === "string") {
    return node.trim() === "" ? null : node;
  }

  if (typeof node === "number" || typeof node === "boolean" || node == null) {
    return node;
  }

  if (Array.isArray(node)) {
    return node
      .map(pruneEmptyNodes)
      .filter(
        (child): child is Exclude<ReactNode, null | undefined | boolean> =>
          child !== null && child !== undefined && child !== false,
      );
  }

  if (!isValidElement(node)) {
    return node;
  }

  const element = node as ReactElement<any>;
  const elementProps = element.props as { children?: ReactNode };
  const tagName = typeof node.type === "string" ? node.type : null;

  if (tagName && voidElements.has(tagName)) {
    return element;
  }

  const children = Children.toArray(elementProps.children)
    .map(pruneEmptyNodes)
    .filter(
      (child): child is Exclude<ReactNode, null | undefined | boolean> =>
        child !== null && child !== undefined && child !== false,
    );

  if (tagName && children.length === 0) {
    return null;
  }

  return cloneElement(element, elementProps, children);
}

export function removeEmptyTags(html: string) {
  return renderToStaticMarkup(<>{pruneEmptyNodes(parse(html) as ReactNode)}</>);
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
