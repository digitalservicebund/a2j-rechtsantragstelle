import { z } from "zod";
import { HasOptionalStrapiIdSchema } from "./HasStrapiId";
import DateInput from "~/components/inputs/DateInput";
import {
  flattenStrapiErrors,
  StrapiErrorRelationSchema,
} from "~/services/cms/flattenStrapiErrors";
import type { InputProps } from "~/components/inputs/Input";

export const StrapiDateInputSchema = z
  .object({
    __component: z.literal("form-elements.date-input").optional(),
    name: z.string(),
    label: z.string().nullable(),
    placeholder: z.string().nullable().optional(),
    errors: StrapiErrorRelationSchema,
  })
  .merge(HasOptionalStrapiIdSchema);

type StrapiDateInput = z.infer<typeof StrapiDateInputSchema>;

export const renderDateInputFromStrapi = (strapiDateInput: StrapiDateInput) => {
  const props: InputProps = {
    name: strapiDateInput.name,
    errorMessages: flattenStrapiErrors(strapiDateInput.errors),
  };

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
