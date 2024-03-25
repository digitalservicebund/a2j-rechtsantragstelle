import { z } from "zod";
import { HasOptionalStrapiIdSchema } from "./HasStrapiId";
import { omitNull } from "~/util/omitNull";
import { TextareaPropsSchema } from "~/components/inputs/Textarea";
import {
  flattenStrapiErrors,
  StrapiErrorRelationSchema,
} from "~/services/cms/flattenStrapiErrors";

const StrapiTextareaSchema = z
  .object({
    name: z.string(),
    description: z.string().nullable(),
    label: z.string().nullable(),
    placeholder: z.string().nullable(),
    errors: StrapiErrorRelationSchema,
  })
  .merge(HasOptionalStrapiIdSchema);

type StrapiTextarea = z.infer<typeof StrapiTextareaSchema>;

export const StrapiTextareaComponentSchema = StrapiTextareaSchema.extend({
  __component: z.literal("form-elements.textarea"),
});

export const getTextareaProps = (cmsData: StrapiTextarea) => {
  const errorMessages = flattenStrapiErrors(cmsData.errors);
  return TextareaPropsSchema.parse(omitNull({ ...cmsData, errorMessages }));
};
