import { z } from "zod";
import { StrapiErrorRelationSchema } from "~/services/cms/models/StrapiErrorRelationSchema";
import { HasOptionalStrapiIdSchema } from "../models/HasStrapiId";
import { strapiOptionalStringSchema } from "../models/strapiOptionalString";
import { strapiWidthSchema } from "../models/strapiWidth";

export const StrapiInputComponentSchema = z
  .object({
    name: z.string(),
    label: strapiOptionalStringSchema,
    type: z.enum(["text", "number"]),
    placeholder: strapiOptionalStringSchema,
    suffix: strapiOptionalStringSchema,
    errors: StrapiErrorRelationSchema,
    width: strapiWidthSchema,
    helperText: strapiOptionalStringSchema,
    __component: z.literal("form-elements.input"),
  })
  .merge(HasOptionalStrapiIdSchema)
  .transform(({ errors, ...cmsData }) => ({
    ...cmsData,
    errorMessages: errors,
  }));
