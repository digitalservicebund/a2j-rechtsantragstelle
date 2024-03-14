import { z } from "zod";
import { HasOptionalStrapiIdSchema } from "./HasStrapiId";
import DateInput from "~/components/inputs/DateInput";
import {
  flattenStrapiErrors,
  StrapiErrorRelationSchema,
} from "~/services/cms/flattenStrapiErrors";
import type { InputProps } from "~/components/inputs/Input";

const StrapiDateInputSchema = z
  .object({
    name: z.string(),
    label: z.string().nullable(),
    placeholder: z.string().nullable().optional(),
    errors: StrapiErrorRelationSchema,
  })
  .merge(HasOptionalStrapiIdSchema);

type StrapiDateInput = z.infer<typeof StrapiDateInputSchema>;

export const StrapiDateInputComponentSchema = StrapiDateInputSchema.extend({
  __component: z.literal("form-elements.date-input"),
});

export const renderDateInputFromStrapi = (strapiDateInput: StrapiDateInput) => {
  const props = {
    name: strapiDateInput.name,
    errorMessages: flattenStrapiErrors(strapiDateInput.errors),
  } satisfies InputProps;

  return (
    <DateInput
      {...props}
      {...(strapiDateInput.label && { label: strapiDateInput.label })}
      {...(strapiDateInput.placeholder && {
        placeholder: strapiDateInput.placeholder,
      })}
    />
  );
};
