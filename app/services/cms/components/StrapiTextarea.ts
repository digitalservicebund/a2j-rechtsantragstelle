import { z } from "zod";
import { StrapiDetailsSchema } from "~/services/cms/models/StrapiDetails";
import { StrapiErrorRelationSchema } from "~/services/cms/models/StrapiErrorRelationSchema";
import { StrapiOptionalIntegerSchema } from "~/services/cms/models/StrapiOptionalInteger";
import { StrapiRichTextOptionalSchema } from "~/services/validation/richtext";
import { omitNull } from "~/util/omitNull";
import { HasStrapiIdSchema } from "../models/HasStrapiId";
import { StrapiOptionalStringSchema } from "../models/StrapiOptionalString";

export const StrapiTextareaComponentSchema = z
  .object({
    __component: z.literal("form-elements.textarea"),
    name: z.string(),
    description: StrapiRichTextOptionalSchema(),
    details: StrapiDetailsSchema.nullable().transform(omitNull),
    label: StrapiOptionalStringSchema,
    placeholder: StrapiOptionalStringSchema,
    errors: StrapiErrorRelationSchema,
    maxLength: StrapiOptionalIntegerSchema,
  })
  .merge(HasStrapiIdSchema)
  .transform(({ errors, ...cmsData }) => ({
    ...cmsData,
    errorMessages: errors,
  }));
