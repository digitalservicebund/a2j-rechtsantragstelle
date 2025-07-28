import { z } from "zod";
import { StrapiErrorRelationSchema } from "~/services/cms/models/StrapiErrorRelationSchema";
import { HasStrapiIdSchema } from "../models/HasStrapiId";
import { StrapiOptionalStringSchema } from "../models/StrapiOptionalString";

export const StrapiTimeInputComponentSchema = z
  .object({
    name: z.string(),
    label: StrapiOptionalStringSchema,
    placeholder: StrapiOptionalStringSchema,
    errors: StrapiErrorRelationSchema,
    __component: z.literal("form-elements.time-input"),
    ...HasStrapiIdSchema.shape,
  })
  .transform(({ errors, ...cmsData }) => ({
    ...cmsData,
    errorMessages: errors,
  }));
