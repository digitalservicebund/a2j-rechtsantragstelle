import { z } from "zod";
import { HasOptionalStrapiIdSchema } from "./HasStrapiId";
import { OptionalStrapiLinkIdentifierSchema } from "./HasStrapiLinkIdentifier";
import { omitNull } from "~/util/omitNull";
import { ListPropsSchema } from "~/components/List";
import { ArrayElementPropsSchema } from "~/components/ArrayElement";
import { HeadingPropsSchema } from "~/components/Heading";
import { getArrayElementProps } from "./StrapiArrayElement";

export const StrapiArraySummarySchema = z
  .object({
    __component: z.literal("page.array-summary").optional(),
    identifier: z.string().optional(),
    heading: HeadingPropsSchema,
    editButtonText: z.string(),
    deleteButtonText: z.string(),
    addButtonText: z.string(),
    items: z.array(ArrayElementPropsSchema),
  })
  .merge(HasOptionalStrapiIdSchema)
  .merge(OptionalStrapiLinkIdentifierSchema);

type StrapiArraySummary = z.infer<typeof StrapiArraySummarySchema>;

export const getArraySummaryProps = (cmsData: StrapiArraySummary) => {
  const items = cmsData.items.map(getArrayElementProps);
  return ListPropsSchema.parse(omitNull({ ...cmsData, items }));
};
