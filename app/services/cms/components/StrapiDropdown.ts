import { z } from "zod";
import { StrapiErrorRelationSchema } from "~/services/cms/models/StrapiErrorRelationSchema";
import { HasStrapiIdSchema } from "../models/HasStrapiId";
import { StrapiOptionalStringSchema } from "../models/StrapiOptionalString";
import { strapiWidthLookupMap } from "../models/StrapiWidth";

export const StrapiDropdownComponentSchema = z
  .object({
    __component: z.literal("form-elements.dropdown"),
    name: z.string(),
    label: StrapiOptionalStringSchema,
    altLabel: StrapiOptionalStringSchema,
    options: z.array(z.object({ value: z.string(), text: z.string() })),
    placeholder: StrapiOptionalStringSchema,
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
