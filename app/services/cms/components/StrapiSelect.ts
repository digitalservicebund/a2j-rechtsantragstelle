import { z } from "zod";
import { StrapiErrorRelationSchema } from "~/services/cms/models/StrapiErrorRelationSchema";
import { HasOptionalStrapiIdSchema } from "../models/HasStrapiId";
import { strapiOptionalStringSchema } from "../models/strapiOptionalString";
import { StrapiSelectOptionSchema } from "../models/StrapiSelectOption";

export const StrapiSelectComponentSchema = z
  .object({
    name: z.string(),
    label: strapiOptionalStringSchema,
    altLabel: strapiOptionalStringSchema,
    options: z.array(StrapiSelectOptionSchema),
    errors: StrapiErrorRelationSchema,
  })
  .merge(HasOptionalStrapiIdSchema)
  .transform(({ errors, ...cmsData }) => ({
    ...cmsData,
    errorMessages: errors,
    __component: "form-elements.select" as const,
  }));
