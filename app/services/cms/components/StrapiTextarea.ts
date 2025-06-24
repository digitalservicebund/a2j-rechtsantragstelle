import { z } from "zod";
import { StrapiDetailsSchema } from "~/services/cms/models/StrapiDetails";
import { StrapiErrorRelationSchema } from "~/services/cms/models/StrapiErrorRelationSchema";
import { buildRichTextValidation } from "~/services/validation/richtext";
import { omitNull } from "~/util/omitNull";
import { HasOptionalStrapiIdSchema } from "../models/HasStrapiId";

export const StrapiTextareaComponentSchema = z
  .object({
    __component: z.literal("form-elements.textarea"),
    name: z.string(),
    description: buildRichTextValidation().nullable().transform(omitNull),
    details: StrapiDetailsSchema.nullable().transform(omitNull),
    label: z.string().nullable().transform(omitNull),
    placeholder: z.string().nullable().transform(omitNull),
    errors: StrapiErrorRelationSchema,
    maxLength: z.number().nullable().transform(omitNull),
  })
  .merge(HasOptionalStrapiIdSchema)
  .transform(({ errors, ...cmsData }) => ({
    ...cmsData,
    errorMessages: errors,
  }));
