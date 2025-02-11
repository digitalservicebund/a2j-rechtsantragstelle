import pick from "lodash/pick";
import { Renderer } from "marked";
import { z } from "zod";
import { StrapiRichTextOptionalSchema } from "~/services/validation/richtext";
import { omitNull } from "~/util/omitNull";
import { HasOptionalStrapiIdSchema } from "./HasStrapiId";
import { OptionalStrapiLinkIdentifierSchema } from "./HasStrapiLinkIdentifier";
import { StrapiBackgroundSchema } from "./StrapiBackground";
import { StrapiContainerSchema } from "./StrapiContainer";
import { StrapiHeadingSchema } from "./StrapiHeading";
import { StrapiListItemSchema } from "./StrapiListItem";

export const listRenderer: Partial<Renderer> = {
  paragraph({ tokens }) {
    return `<p class="ds-subhead max-w-full">${this.parser?.parseInline(tokens)}</p>`;
  },
};

export const StrapiListSchema = z
  .object({
    heading: StrapiHeadingSchema.nullable().transform(omitNull).optional(),
    subheading: StrapiRichTextOptionalSchema(listRenderer),
    items: z.array(StrapiListItemSchema),
    isNumeric: z.boolean(),
    outerBackground: StrapiBackgroundSchema.nullable(),
    container: StrapiContainerSchema,
  })
  .merge(HasOptionalStrapiIdSchema)
  .merge(OptionalStrapiLinkIdentifierSchema)
  .transform((cmsData) => ({
    __component: "page.list" as const,
    ...pick(
      cmsData,
      "heading",
      "id",
      "subheading",
      "isNumeric",
      "identifier",
      "items",
    ),
  }));
