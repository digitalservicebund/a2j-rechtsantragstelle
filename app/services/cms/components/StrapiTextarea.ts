import { z } from "zod";
import { TextareaProps } from "~/components/inputs/Textarea";
import {
  flattenStrapiErrors,
  StrapiErrorRelationSchema,
} from "~/services/cms/flattenStrapiErrors";
import { StrapiDetailsSchema } from "~/services/cms/models/StrapiDetails";
import { buildRichTextValidation } from "~/services/validation/richtext";
import { omitNull } from "~/util/omitNull";
import { HasOptionalStrapiIdSchema } from "../models/HasStrapiId";

const StrapiTextareaSchema = z
  .object({
    name: z.string(),
    description: buildRichTextValidation().nullable(),
    details: StrapiDetailsSchema.nullable(),
    label: z.string().nullable(),
    placeholder: z.string().nullable(),
    errors: StrapiErrorRelationSchema,
    maxLength: z.number().nullable(),
  })
  .merge(HasOptionalStrapiIdSchema);

export const StrapiTextareaComponentSchema = StrapiTextareaSchema.extend({
  __component: z.literal("form-elements.textarea"),
});

type StrapiTextarea = z.infer<typeof StrapiTextareaSchema>;

export const getTextareaProps = (cmsData: StrapiTextarea): TextareaProps => ({
  ...omitNull(cmsData),
  errorMessages: flattenStrapiErrors(cmsData.errors),
});
