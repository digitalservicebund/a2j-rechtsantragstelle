import { z } from "zod";
import type { SelectProps } from "~/components/inputs/Select";
import {
  flattenStrapiErrors,
  StrapiErrorRelationSchema,
} from "~/services/cms/flattenStrapiErrors";
import { omitNull } from "~/util/omitNull";
import { HasOptionalStrapiIdSchema } from "../models/HasStrapiId";

const StrapiDropdownSchema = z
  .object({
    name: z.string(),
    label: z.string().nullable(),
    altLabel: z.string().nullable(),
    options: z.array(z.object({ value: z.string(), text: z.string() })),
    placeholder: z.string().nullable(),
    errors: StrapiErrorRelationSchema,
    width: z
      .enum(["characters16", "characters24", "characters36", "characters54"])
      .nullable(),
  })
  .merge(HasOptionalStrapiIdSchema);

type StrapiDropdown = z.infer<typeof StrapiDropdownSchema>;

export const StrapiDropdownComponentSchema = StrapiDropdownSchema.extend({
  __component: z.literal("form-elements.dropdown"),
});

/**
 * A Strapi "Dropdown" is really just a Select
 */
export const getSelectProps = (cmsData: StrapiDropdown): SelectProps => ({
  errorMessages: flattenStrapiErrors(cmsData.errors),
  ...omitNull(cmsData),
  width: cmsData.width?.replace("characters", "") as SelectProps["width"],
});
