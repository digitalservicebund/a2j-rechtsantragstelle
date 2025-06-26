import { z } from "zod";
import { StrapiErrorRelationSchema } from "~/services/cms/models/StrapiErrorRelationSchema";
import { HasOptionalStrapiIdSchema } from "../models/HasStrapiId";
import { StrapiOptionalStringSchema } from "../models/StrapiOptionalString";

export const StrapiDateInputComponentSchema = z
  .object({
    name: z.string(),
    label: StrapiOptionalStringSchema,
    placeholder: StrapiOptionalStringSchema,
    errors: StrapiErrorRelationSchema,
    __component: z.literal("form-elements.date-input"),
  })
  .merge(HasOptionalStrapiIdSchema)
  .transform(({ errors, ...cmsData }) => ({
    ...cmsData,
    errorMessages: errors,
  }));
