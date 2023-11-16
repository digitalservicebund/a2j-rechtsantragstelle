import { z } from "zod";
import { HasOptionalStrapiIdSchema } from "./HasStrapiId";
import Checkbox from "~/components/inputs/Checkbox";

export const StrapiCheckboxSchema = z
  .object({
    __component: z.literal("form-elements.checkbox").optional(),
    name: z.string(),
    label: z.string().nullable(),
    value: z.string().nullable(),
  })
  .merge(HasOptionalStrapiIdSchema);

export const renderCheckboxFromStrapi = (
  strapiCheckbox: z.infer<typeof StrapiCheckboxSchema>,
) => (
  <Checkbox
    name={strapiCheckbox.name}
    label={strapiCheckbox.label ?? undefined}
    value={strapiCheckbox.value ?? undefined}
  />
);
