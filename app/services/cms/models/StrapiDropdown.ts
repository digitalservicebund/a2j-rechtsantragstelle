import { z } from "zod";
import { HasOptionalStrapiIdSchema, HasStrapiIdSchema } from "./HasStrapiId";
import { StrapiErrorCategorySchema } from "./StrapiErrorCategory";
import { omitNull } from "~/util/omitNull";
import { DropdownPropsSchema } from "~/components/inputs/Select";
import {
  flattenStrapiErrors,
  StrapiErrorRelationSchema,
} from "~/services/cms/flattenStrapiErrors";

export const StrapiDropdownSchema = z
  .object({
    __component: z.literal("form-elements.dropdown").optional(),
    name: z.string(),
    label: z.string().nullable(),
    altLabel: z.string().nullable(),
    options: z.array(z.object({ value: z.string(), text: z.string() })),
    placeholder: z.string().nullish(),
    errors: StrapiErrorRelationSchema,
  })
  .merge(HasOptionalStrapiIdSchema);

type StrapiDropdown = z.infer<typeof StrapiDropdownSchema>;

export const getDropdownProps = (cmsData: StrapiDropdown) => {
  const errorMessages = flattenStrapiErrors(cmsData.errors);
  return DropdownPropsSchema.parse(omitNull({ ...cmsData, errorMessages }));
};
