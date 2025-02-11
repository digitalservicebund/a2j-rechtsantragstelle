import pick from "lodash/pick";
import { Renderer } from "marked";
import { z } from "zod";
import { type ListProps } from "~/components/List";
import { buildRichTextValidation } from "~/services/validation/richtext";
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

const StrapiListSchema = z
  .object({
    heading: StrapiHeadingSchema.nullable(),
    subheading: buildRichTextValidation(listRenderer).nullable(),
    items: z.array(StrapiListItemSchema),
    isNumeric: z.boolean(),
    outerBackground: StrapiBackgroundSchema.nullable(),
    container: StrapiContainerSchema,
  })
  .merge(HasOptionalStrapiIdSchema)
  .merge(OptionalStrapiLinkIdentifierSchema);

type StrapiList = z.infer<typeof StrapiListSchema>;

export const StrapiListComponentSchema = StrapiListSchema.extend({
  __component: z.literal("page.list"),
});

export const getListProps = (cmsData: StrapiList): ListProps => {
  return omitNull({
    ...pick(
      cmsData,
      "heading",
      "subheading",
      "isNumeric",
      "identifier",
      "items",
    ),
  });
};
