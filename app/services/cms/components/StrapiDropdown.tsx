import { z } from "zod";
import Select from "~/components/inputs/Select";
import {
  flattenStrapiErrors,
  StrapiErrorRelationSchema,
} from "~/services/cms/flattenStrapiErrors";
import { omitNull } from "~/util/omitNull";
import { HasOptionalStrapiIdSchema } from "../models/HasStrapiId";

const StrapiDropdownSchema = z
  .object({
    name: z.string(),
    label: z.string().nullable(),
    altLabel: z.string().nullable(),
    options: z.array(z.object({ value: z.string(), text: z.string() })),
    placeholder: z.string().nullable(),
    errors: StrapiErrorRelationSchema,
  })
  .merge(HasOptionalStrapiIdSchema);

type StrapiDropdown = z.infer<typeof StrapiDropdownSchema>;

export const StrapiDropdownComponentSchema = StrapiDropdownSchema.extend({
  __component: z.literal("form-elements.dropdown"),
});

const StrapiDropdown = ({ errors, ...props }: StrapiDropdown) => (
  <Select errorMessages={flattenStrapiErrors(errors)} {...omitNull(props)} />
);

export default StrapiDropdown;
