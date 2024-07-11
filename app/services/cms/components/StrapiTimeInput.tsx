import { z } from "zod";
import TimeInput from "~/components/inputs/TimeInput";
import {
  flattenStrapiErrors,
  StrapiErrorRelationSchema,
} from "~/services/cms/flattenStrapiErrors";
import { omitNull } from "~/util/omitNull";
import { HasOptionalStrapiIdSchema } from "../models/HasStrapiId";

const StrapiTimeInputSchema = z
  .object({
    name: z.string(),
    label: z.string().nullable(),
    placeholder: z.string().nullable(),
    errors: StrapiErrorRelationSchema,
  })
  .merge(HasOptionalStrapiIdSchema);

export const StrapiTimeInputComponentSchema = StrapiTimeInputSchema.extend({
  __component: z.literal("form-elements.time-input"),
});

type StrapiTimeInput = z.infer<typeof StrapiTimeInputSchema>;

export const StrapiTimeInput = ({ errors, ...props }: StrapiTimeInput) => (
  <TimeInput errorMessages={flattenStrapiErrors(errors)} {...omitNull(props)} />
);
