import { z } from "zod";
import { StrapiErrorRelationSchema } from "~/services/cms/models/StrapiErrorRelationSchema";
import { HasOptionalStrapiIdSchema } from "../models/HasStrapiId";
import { StrapiOptionalStringSchema } from "../models/StrapiOptionalString";

const StrapiSelectOptionSchema = z.object({
  text: z.string(),
  value: z.string(),
});

export type StrapiSelectOption = z.infer<typeof StrapiSelectOptionSchema>;

export const StrapiSelectComponentSchema = z
  .object({
    name: z.string(),
    __component: z.literal("form-elements.select"),
    label: StrapiOptionalStringSchema,
    altLabel: StrapiOptionalStringSchema,
    options: z.array(StrapiSelectOptionSchema),
    errors: StrapiErrorRelationSchema,
  })
  .merge(HasOptionalStrapiIdSchema)
  .transform(({ errors, ...cmsData }) => ({
    ...cmsData,
    errorMessages: errors,
  }));
