import { z } from "zod";
import { HasOptionalStrapiIdSchema } from "./HasStrapiId";
import TimeInput from "~/components/inputs/TimeInput";
import {
  flattenStrapiErrors,
  StrapiErrorRelationSchema,
} from "~/services/cms/flattenStrapiErrors";

const StrapiTimeInputSchema = z
  .object({
    name: z.string(),
    label: z.string().nullable(),
    placeholder: z.string().nullable().optional(),
    errors: StrapiErrorRelationSchema,
  })
  .merge(HasOptionalStrapiIdSchema);

export const StrapiTimeInputComponentSchema = StrapiTimeInputSchema.extend({
  __component: z.literal("form-elements.time-input"),
});

type StrapiTimeInput = z.infer<typeof StrapiTimeInputSchema>;

export const StrapiTimeInput = ({
  errors,
  label,
  placeholder,
  ...props
}: StrapiTimeInput) => (
  <TimeInput
    label={label ?? undefined}
    placeholder={placeholder ?? undefined}
    errorMessages={flattenStrapiErrors(errors)}
    {...props}
  />
);
