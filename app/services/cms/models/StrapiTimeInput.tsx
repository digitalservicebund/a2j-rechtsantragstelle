import { z } from "zod";
import { HasOptionalStrapiIdSchema } from "./HasStrapiId";
import TimeInput from "~/components/inputs/TimeInput";
import {
  flattenStrapiErrors,
  StrapiErrorRelationSchema,
} from "~/services/cms/flattenStrapiErrors";
import type { InputProps } from "~/components/inputs/Input";

const StrapiTimeInputSchema = z
  .object({
    name: z.string(),
    label: z.string().nullable(),
    placeholder: z.string().nullable().optional(),
    errors: StrapiErrorRelationSchema,
  })
  .merge(HasOptionalStrapiIdSchema);

type StrapiTimeInput = z.infer<typeof StrapiTimeInputSchema>;

export const StrapiTimeInputComponentSchema = StrapiTimeInputSchema.extend({
  __component: z.literal("form-elements.time-input"),
});

export const renderTimeInputFromStrapi = (strapiTimeInput: StrapiTimeInput) => {
  const props: InputProps = {
    name: strapiTimeInput.name,
    errorMessages: flattenStrapiErrors(strapiTimeInput.errors),
  };

  return (
    <TimeInput
      {...props}
      {...(strapiTimeInput.label && { label: strapiTimeInput.label })}
      {...(strapiTimeInput.placeholder && {
        placeholder: strapiTimeInput.placeholder,
      })}
    />
  );
};
