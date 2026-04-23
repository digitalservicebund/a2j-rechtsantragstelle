import { type Renderer } from "marked";
import { z } from "zod";
import { StrapiRichTextOptionalSchema } from "~/services/validation/richtext";
import { HasStrapiIdSchema } from "../HasStrapiId";
import { OptionalStrapiLinkIdentifierSchema } from "../HasStrapiLinkIdentifier";
import { StrapiHeadingOptionalSchema } from "./StrapiHeading";
import { StrapiListItemSchema } from "./StrapiListItem";
import { StrapiPaddingOptionalSchema } from "../StrapiPadding";
import { StrapiBackgroundColorOptionalSchema } from "../StrapiBackgroundColor";

export const listRenderer: Partial<Renderer> = {
  paragraph({ tokens }) {
    return `<p class="ds-subhead max-w-full">${this.parser?.parseInline(tokens)}</p>`;
  },
};

export const StrapiListSchema = z.object({
  heading: StrapiHeadingOptionalSchema,
  subheading: StrapiRichTextOptionalSchema(listRenderer),
  items: z.array(StrapiListItemSchema),
  variant: z.enum(["unordered", "numbered", "stepByStep"]).default("unordered"),
  paddingTop: StrapiPaddingOptionalSchema,
  paddingBottom: StrapiPaddingOptionalSchema,
  sectionBackgroundColor: StrapiBackgroundColorOptionalSchema,
  __component: z.literal("page.list"),
  ...HasStrapiIdSchema.shape,
  ...OptionalStrapiLinkIdentifierSchema.shape,
});
