import { type Renderer } from "marked";
import { z } from "zod";
import { StrapiRichTextOptionalSchema } from "~/services/validation/richtext";
import { HasStrapiIdSchema } from "./HasStrapiId";
import { OptionalStrapiLinkIdentifierSchema } from "./HasStrapiLinkIdentifier";
import { StrapiBackgroundOptionalSchema } from "./StrapiBackground";
import { StrapiContainerSchema } from "./StrapiContainer";
import { StrapiHeadingOptionalSchema } from "./StrapiHeading";
import { StrapiListItemSchema } from "./StrapiListItem";

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
  outerBackground: StrapiBackgroundOptionalSchema,
  container: StrapiContainerSchema,
  __component: z.literal("page.list"),
  ...HasStrapiIdSchema.shape,
  ...OptionalStrapiLinkIdentifierSchema.shape,
});
