import { z } from "zod";
import { InputProps } from "~/components/inputs/Input";
import {
  flattenStrapiErrors,
  StrapiErrorRelationSchema,
} from "~/services/cms/flattenStrapiErrors";
import { omitNull } from "~/util/omitNull";
import { HasOptionalStrapiIdSchema } from "../models/HasStrapiId";

const StrapiDateInputSchema = z
  .object({
    name: z.string(),
    label: z.string().nullable(),
    placeholder: z.string().nullable(),
    errors: StrapiErrorRelationSchema,
  })
  .merge(HasOptionalStrapiIdSchema);

export const StrapiDateInputComponentSchema = StrapiDateInputSchema.extend({
  __component: z.literal("form-elements.date-input"),
});

type StrapiDateInput = z.infer<typeof StrapiDateInputSchema>;

export const getDateInputProps = (cmsData: StrapiDateInput): InputProps => ({
  ...omitNull(cmsData),
  errorMessages: flattenStrapiErrors(cmsData.errors),
});
