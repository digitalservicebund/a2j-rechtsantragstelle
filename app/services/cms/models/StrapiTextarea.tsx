import { z } from "zod";
import { HasOptionalStrapiIdSchema } from "./HasStrapiId";
import Textarea from "~/components/inputs/Textarea";
import {
  flattenStrapiErrors,
  StrapiErrorRelationSchema,
} from "~/services/cms/flattenStrapiErrors";

const StrapiTextareaSchema = z
  .object({
    name: z.string(),
    label: z.string().nullable(),
    placeholder: z.string().nullable(),
    errors: StrapiErrorRelationSchema,
  })
  .merge(HasOptionalStrapiIdSchema);

export const StrapiTextareaComponentSchema = StrapiTextareaSchema.extend({
  __component: z.literal("form-elements.textarea"),
});

type StrapiTextarea = z.infer<typeof StrapiTextareaSchema>;

export const StrapiTextarea = ({ errors, ...props }: StrapiTextarea) => (
  <Textarea {...props} errorMessages={flattenStrapiErrors(errors)} />
);
