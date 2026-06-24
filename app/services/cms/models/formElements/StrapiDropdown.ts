import { StrapiErrorRelationSchema } from "~/services/cms/models/StrapiErrorRelationSchema";
import { HasStrapiIdSchema } from "../HasStrapiId";
import { StrapiStringOptionalSchema } from "../StrapiStringOptional";
import { strapiWidthLookupMap } from "../StrapiWidth";
import { z } from "zod";

const StrapiOptionSchema = z.object({
  value: z.string(),
  text: z.string(),
  preSelected: z.boolean().default(false),
});

export type DropdownOption = z.infer<typeof StrapiOptionSchema>;

export const StrapiDropdownComponentSchema = z
  .object({
    __component: z.literal("form-elements.dropdown"),
    name: z.string(),
    label: StrapiStringOptionalSchema,
    altLabel: StrapiStringOptionalSchema,
    options: z.array(StrapiOptionSchema),
    placeholder: StrapiStringOptionalSchema,
    suffix: StrapiStringOptionalSchema,
    errors: StrapiErrorRelationSchema,
    width: z
      .enum(["characters16", "characters24", "characters36", "characters54"])
      .nullable()
      .transform((val) => strapiWidthLookupMap[val ?? ""]),
    ...HasStrapiIdSchema.shape,
  })
  .transform(({ errors, ...cmsData }) => ({
    ...cmsData,
    errorMessages: errors,
  }));
