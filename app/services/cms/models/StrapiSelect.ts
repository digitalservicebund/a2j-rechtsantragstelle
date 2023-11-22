import { z } from "zod";
import { HasOptionalStrapiIdSchema, HasStrapiIdSchema } from "./HasStrapiId";
import { StrapiSelectOptionSchema } from "./StrapiSelectOption";
import { StrapiErrorCategorySchema } from "./StrapiErrorCategory";
import { RadioGroupPropsSchema } from "~/components/inputs/RadioGroup";
import { omitNull } from "~/util/omitNull";
import {
  flattenStrapiErrors,
  StrapiErrorRelationSchema,
} from "~/services/cms/flattenStrapiErrors";

export const StrapiSelectSchema = z
  .object({
    __component: z.literal("form-elements.select").optional(),
    name: z.string(),
    label: z.string().nullable(),
    altLabel: z.string().nullable(),
    options: z.array(StrapiSelectOptionSchema),
    errors: StrapiErrorRelationSchema,
  })
  .merge(HasOptionalStrapiIdSchema);

export type StrapiSelect = z.infer<typeof StrapiSelectSchema>;

export const getRadioGroupProps = (cmsData: StrapiSelect) => {
  const errorMessages = flattenStrapiErrors(cmsData.errors);
  return RadioGroupPropsSchema.parse(omitNull({ ...cmsData, errorMessages }));
};
