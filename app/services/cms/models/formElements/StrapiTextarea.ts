import { z } from "zod";
import { StrapiDetailsSchema } from "~/services/cms/models/content/StrapiDetails";
import { StrapiErrorRelationSchema } from "~/services/cms/models/StrapiErrorRelationSchema";
import { StrapiOptionalIntegerSchema } from "~/services/cms/models/StrapiOptionalInteger";
import { StrapiRichTextOptionalSchema } from "~/services/validation/richtext";
import { omitNull } from "~/util/omitNull";
import { HasStrapiIdSchema } from "../HasStrapiId";
import { StrapiStringOptionalSchema } from "../StrapiStringOptional";

export const StrapiTextareaComponentSchema = z
  .object({
    __component: z.literal("form-elements.textarea"),
    name: z.string(),
    description: StrapiRichTextOptionalSchema(),
    details: StrapiDetailsSchema.nullable().transform(omitNull).optional(),
    label: StrapiStringOptionalSchema,
    placeholder: StrapiStringOptionalSchema,
    errors: StrapiErrorRelationSchema,
    maxLength: StrapiOptionalIntegerSchema,
    ...HasStrapiIdSchema.shape,
  })
  .transform(({ errors, ...cmsData }) => ({
    ...cmsData,
    errorMessages: errors,
  }));
