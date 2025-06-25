import { z } from "zod";
import { StrapiErrorRelationSchema } from "~/services/cms/models/StrapiErrorRelationSchema";
import { HasOptionalStrapiIdSchema } from "../models/HasStrapiId";
import { strapiOptionalStringSchema } from "../models/strapiOptionalString";

export const StrapiDateInputComponentSchema = z
  .object({
    name: z.string(),
    label: strapiOptionalStringSchema,
    placeholder: strapiOptionalStringSchema,
    errors: StrapiErrorRelationSchema,
    __component: z.literal("form-elements.date-input"),
  })
  .merge(HasOptionalStrapiIdSchema)
  .transform(({ errors, ...cmsData }) => ({
    ...cmsData,
    errorMessages: errors,
  }));
