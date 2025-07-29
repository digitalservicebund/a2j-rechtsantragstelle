import { z } from "zod";
import { StrapiErrorRelationSchema } from "~/services/cms/models/StrapiErrorRelationSchema";
import { HasStrapiIdSchema } from "../models/HasStrapiId";
import { StrapiStringOptionalSchema } from "../models/StrapiStringOptional";

const StrapiSelectOptionSchema = z.object({
  text: z.string(),
  value: z.string(),
});

export const StrapiSelectComponentSchema = z
  .object({
    name: z.string(),
    __component: z.literal("form-elements.select"),
    label: StrapiStringOptionalSchema,
    altLabel: StrapiStringOptionalSchema,
    options: z.array(StrapiSelectOptionSchema),
    errors: StrapiErrorRelationSchema,
  })
  .merge(HasStrapiIdSchema)
  .transform(({ errors, ...cmsData }) => ({
    ...cmsData,
    errorMessages: errors,
  }));
