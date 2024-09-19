import sanitizeHtml from "sanitize-html";
import {
  openInNewAllowedAttributes,
  openInNewAllowedTags,
} from "~/components/OpenInNewTabIcon";

const allowedTags =
  sanitizeHtml.defaults.allowedTags.concat(openInNewAllowedTags);
const allowedAttributes = {
  a: sanitizeHtml.defaults.allowedAttributes["a"].concat(["rel", "aria-label"]),
  ...openInNewAllowedAttributes,
};
const allowedHeadingClasses = [
  "ds-heading-01-reg",
  "ds-label-01-bold",
  "ds-heading-02-reg",
];

export const sanatize = (html: string) =>
  sanitizeHtml(html, {
    allowedTags,
    allowedClasses: {
      p: ["ds-subhead", "max-w-full"],
      a: ["text-link", "min-h-[24px]", "inline-block"],
      h1: allowedHeadingClasses,
      h2: allowedHeadingClasses,
      h3: allowedHeadingClasses,
      h4: allowedHeadingClasses,
      h5: allowedHeadingClasses,
      h6: allowedHeadingClasses,
    },
    allowedAttributes,
  });
