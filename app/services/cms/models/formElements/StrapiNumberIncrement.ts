import { z } from "zod";
import { StrapiErrorRelationSchema } from "~/services/cms/models/StrapiErrorRelationSchema";
import { stringRequiredSchema } from "~/services/validation/stringRequired";

export const StrapiIncrementSchema = z
  .object({
    __component: z.literal("form-elements.number-increment"),
    name: stringRequiredSchema,
    label: z.string(),
    errors: StrapiErrorRelationSchema,
  })
  .transform(({ errors, ...cmsData }) => ({
    ...cmsData,
    errorMessages: errors,
  }));
