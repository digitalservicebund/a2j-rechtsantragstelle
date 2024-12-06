import { z } from "zod";
import Textarea from "~/components/inputs/Textarea";
import {
  flattenStrapiErrors,
  StrapiErrorRelationSchema,
} from "~/services/cms/flattenStrapiErrors";
import { StrapiDetailsSchema } from "~/services/cms/models/StrapiDetails";
import { TEXTAREA_CHAR_LIMIT } from "~/services/validation/inputlimits";
import { omitNull } from "~/util/omitNull";
import { HasOptionalStrapiIdSchema } from "../models/HasStrapiId";

const StrapiTextareaSchema = z
  .object({
    name: z.string(),
    description: z.string().nullable(),
    details: StrapiDetailsSchema.nullable(),
    label: z.string().nullable(),
    placeholder: z.string().nullable(),
    errors: StrapiErrorRelationSchema,
    maxLength: z.number().nullable(),
  })
  .merge(HasOptionalStrapiIdSchema);

type StrapiTextarea = z.infer<typeof StrapiTextareaSchema>;

export const StrapiTextareaComponentSchema = StrapiTextareaSchema.extend({
  __component: z.literal("form-elements.textarea"),
});

export const StrapiTextarea = ({ errors, ...props }: StrapiTextarea) => {
  const maxLength = props.maxLength ?? TEXTAREA_CHAR_LIMIT;
  return (
    <Textarea
      {...omitNull(props)}
      maxLength={maxLength}
      errorMessages={flattenStrapiErrors(errors)}
    />
  );
};
