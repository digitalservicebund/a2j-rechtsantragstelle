import * as xssImport from "xss";
import { openInNewAllowedAttributes } from "~/components/common/OpenInNewTabIcon";
import { mustachePlaceholderRegex } from "./mustachePlaceholder";

// Note: type recast of import due to wrong default type export
const xss = xssImport.default as unknown as typeof xssImport;

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
  dt: xss.getDefaultWhiteList().dt?.concat(["class"]),
  ...openInNewAllowedAttributes,
};

const sanitizer = new xss.FilterXSS({
  allowList,
  stripIgnoreTagBody: true,
  onTagAttr: (tag, name, value) => {
    // Allow hrefs that use template placeholders like {{courtWebsite}} or {{{courtWebsite}}}
    const ahref = tag === "a" && name === "href";
    if (ahref && mustachePlaceholderRegex.test(value)) {
      return `${name}="${value}"`;
    }
  },
});

export const sanitizeHtml = (html: string) => sanitizer.process(html);
