import { z } from "zod";
import { HasOptionalStrapiIdSchema } from "./HasStrapiId";
import { omitNull } from "~/util/omitNull";
import { DropdownPropsSchema } from "~/components/inputs/Select";
import {
  flattenStrapiErrors,
  StrapiErrorRelationSchema,
} from "~/services/cms/flattenStrapiErrors";

const StrapiDropdownSchema = z
  .object({
    name: z.string(),
    label: z.string().nullable(),
    altLabel: z.string().nullable(),
    options: z.array(z.object({ value: z.string(), text: z.string() })),
    placeholder: z.string().nullable(),
    errors: StrapiErrorRelationSchema,
  })
  .merge(HasOptionalStrapiIdSchema);

type StrapiDropdown = z.infer<typeof StrapiDropdownSchema>;

export const StrapiDropdownComponentSchema = StrapiDropdownSchema.extend({
  __component: z.literal("form-elements.dropdown"),
});

export const getDropdownProps = (cmsData: StrapiDropdown) => {
  const errorMessages = flattenStrapiErrors(cmsData.errors);
  return DropdownPropsSchema.parse(omitNull({ ...cmsData, errorMessages }));
};
