import { z } from "zod";
import { StrapiErrorRelationSchema } from "~/services/cms/models/StrapiErrorRelationSchema";
import { omitNull } from "~/util/omitNull";
import { HasOptionalStrapiIdSchema } from "../models/HasStrapiId";
import { StrapiSelectOptionSchema } from "../models/StrapiSelectOption";

export const StrapiSelectComponentSchema = z
  .object({
    name: z.string(),
    label: z.string().nullable().transform(omitNull),
    altLabel: z.string().nullable().transform(omitNull),
    options: z.array(StrapiSelectOptionSchema),
    errors: StrapiErrorRelationSchema,
  })
  .merge(HasOptionalStrapiIdSchema)
  .transform(({ errors, ...cmsData }) => ({
    ...cmsData,
    errorMessages: errors,
    __component: "form-elements.select" as const,
  }));
