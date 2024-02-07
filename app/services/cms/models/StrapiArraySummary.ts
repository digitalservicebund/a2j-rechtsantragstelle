import { z } from "zod";
import { HasOptionalStrapiIdSchema } from "./HasStrapiId";
import { OptionalStrapiLinkIdentifierSchema } from "./HasStrapiLinkIdentifier";
import { omitNull } from "~/util/omitNull";
import {
  StrapiArrayElementSchema,
  getArrayElementProps,
} from "./StrapiArrayElement";
import { ArraySummaryPropsSchema } from "~/components/ArraySummary";
import { StrapiHeadingSchema } from "./StrapiHeading";
import { StrapiParagraphSchema, getRichTextProps } from "./StrapiParagraph";

export const StrapiArraySummarySchema = z
  .object({
    __component: z.literal("page.array-summary").optional(),
    identifier: z.string().optional(),
    heading: StrapiHeadingSchema.nullable(),
    content: StrapiParagraphSchema.nullable(),
    arrayKey: z.string(),
    editButtonText: z.string(),
    deleteButtonText: z.string(),
    addButtonText: z.string(),
    items: z.array(StrapiArrayElementSchema),
  })
  .merge(HasOptionalStrapiIdSchema)
  .merge(OptionalStrapiLinkIdentifierSchema);

type StrapiArraySummary = z.infer<typeof StrapiArraySummarySchema>;

export const getArraySummaryProps = (cmsData: StrapiArraySummary) => {
  const items = cmsData.items.map(getArrayElementProps);
  const content = cmsData.content && getRichTextProps(cmsData.content);
  return ArraySummaryPropsSchema.parse(
    omitNull({
      ...cmsData,
      items,
      content,
    }),
  );
};
