import { z } from "zod";
import { StrapiDetailsSchema } from "~/services/cms/models/StrapiDetails";
import { StrapiErrorRelationSchema } from "~/services/cms/models/StrapiErrorRelationSchema";
import { StrapiRichTextOptionalSchema } from "~/services/validation/richtext";
import { omitNull } from "~/util/omitNull";
import { HasOptionalStrapiIdSchema } from "../models/HasStrapiId";
import { strapiOptionalStringSchema } from "../models/strapiOptionalString";

export const StrapiTextareaComponentSchema = z
  .object({
    __component: z.literal("form-elements.textarea"),
    name: z.string(),
    description: StrapiRichTextOptionalSchema(),
    details: StrapiDetailsSchema.nullable().transform(omitNull),
    label: strapiOptionalStringSchema,
    placeholder: strapiOptionalStringSchema,
    errors: StrapiErrorRelationSchema,
    maxLength: z.number().nullable().transform(omitNull),
  })
  .merge(HasOptionalStrapiIdSchema)
  .transform(({ errors, ...cmsData }) => ({
    ...cmsData,
    errorMessages: errors,
  }));
