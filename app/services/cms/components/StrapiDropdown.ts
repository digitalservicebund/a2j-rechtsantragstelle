import { z } from "zod";
import { StrapiErrorRelationSchema } from "~/services/cms/models/StrapiErrorRelationSchema";
import { omitNull } from "~/util/omitNull";
import { HasOptionalStrapiIdSchema } from "../models/HasStrapiId";
import { strapiWidthToFieldWidth } from "../models/strapiWidth";

export const StrapiDropdownComponentSchema = z
  .object({
    __component: z.literal("form-elements.dropdown"),
    name: z.string(),
    label: z.string().nullable().transform(omitNull),
    altLabel: z.string().nullable().transform(omitNull),
    options: z.array(z.object({ value: z.string(), text: z.string() })),
    placeholder: z.string().nullable().transform(omitNull),
    errors: StrapiErrorRelationSchema,
    width: z
      .enum(["characters16", "characters24", "characters36", "characters54"])
      .nullable()
      .transform(
        (val) =>
          strapiWidthToFieldWidth(val) as "16" | "24" | "36" | "54" | undefined,
      ),
  })
  .merge(HasOptionalStrapiIdSchema)
  .transform(({ errors, ...cmsData }) => ({
    ...cmsData,
    errorMessages: errors,
  }));
