import { z } from "zod";
import { HasOptionalStrapiIdSchema } from "./HasStrapiId";
import Select from "~/components/inputs/Select";
import {
  flattenStrapiErrors,
  StrapiErrorRelationSchema,
} from "~/services/cms/flattenStrapiErrors";

const StrapiDropdownSchema = z
  .object({
    name: z.string(),
    label: z.string().nullable(),
    altLabel: z.string().nullable(),
    options: z.array(z.object({ value: z.string(), text: z.string() })),
    placeholder: z.string().nullish(),
    errors: StrapiErrorRelationSchema,
  })
  .merge(HasOptionalStrapiIdSchema);

export const StrapiDropdownComponentSchema = StrapiDropdownSchema.extend({
  __component: z.literal("form-elements.dropdown"),
});

type StrapiDropdown = z.infer<typeof StrapiDropdownSchema>;

export const StrapiDropdown = ({ errors, ...props }: StrapiDropdown) => (
  <Select errorMessages={flattenStrapiErrors(errors)} {...props} />
);
