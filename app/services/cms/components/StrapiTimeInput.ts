import { z } from "zod";
import { StrapiErrorRelationSchema } from "~/services/cms/models/StrapiErrorRelationSchema";
import { omitNull } from "~/util/omitNull";
import { HasOptionalStrapiIdSchema } from "../models/HasStrapiId";

export const StrapiTimeInputComponentSchema = z
  .object({
    name: z.string(),
    label: z.string().nullable().transform(omitNull),
    placeholder: z.string().nullable().transform(omitNull),
    errors: StrapiErrorRelationSchema,
    __component: z.literal("form-elements.time-input"),
  })
  .merge(HasOptionalStrapiIdSchema)
  .transform(({ errors, ...cmsData }) => ({
    ...cmsData,
    errorMessages: errors,
  }));
