import { z } from "zod";
import { HasOptionalStrapiIdSchema } from "./HasStrapiId";
import DateInput from "~/components/inputs/DateInput";
import {
  flattenStrapiErrors,
  StrapiErrorRelationSchema,
} from "~/services/cms/flattenStrapiErrors";

const StrapiDateInputSchema = z
  .object({
    name: z.string(),
    label: z.string().nullable(),
    placeholder: z.string().nullable().optional(),
    errors: StrapiErrorRelationSchema,
  })
  .merge(HasOptionalStrapiIdSchema);

export const StrapiDateInputComponentSchema = StrapiDateInputSchema.extend({
  __component: z.literal("form-elements.date-input"),
});

type StrapiDateInput = z.infer<typeof StrapiDateInputSchema>;

export const StrapiDateInput = ({ errors, ...props }: StrapiDateInput) => (
  <DateInput errorMessages={flattenStrapiErrors(errors)} {...props} />
);
