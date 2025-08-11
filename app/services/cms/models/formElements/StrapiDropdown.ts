import { z } from "zod";
import { StrapiErrorRelationSchema } from "~/services/cms/models/StrapiErrorRelationSchema";
import { HasStrapiIdSchema } from "../HasStrapiId";
import { StrapiStringOptionalSchema } from "../StrapiStringOptional";
import { strapiWidthLookupMap } from "../StrapiWidth";

export const StrapiDropdownComponentSchema = z
  .object({
    __component: z.literal("form-elements.dropdown"),
    name: z.string(),
    label: StrapiStringOptionalSchema,
    altLabel: StrapiStringOptionalSchema,
    options: z.array(z.object({ value: z.string(), text: z.string() })),
    placeholder: StrapiStringOptionalSchema,
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
