import { z } from "zod";
import { StrapiErrorCategorySchema } from "./StrapiErrorCategory";
import { HasOptionalStrapiIdSchema, HasStrapiIdSchema } from "./HasStrapiId";
import { InputPropsSchema } from "~/components/inputs/Input";
import { omitNull } from "~/util/omitNull";
import Checkbox from "~/components/inputs/Checkbox";
import { StrapiCheckboxSchema } from "~/services/cms/models/StrapiCheckbox";
import DateInput from "~/components/inputs/DateInput";
import {
  flattenStrapiErrors,
  StrapiErrorRelationSchema,
} from "~/services/cms/flattenStrapiErrors";

export const StrapiDateInputSchema = z
  .object({
    __component: z.literal("form-elements.date-input").optional(),
    name: z.string(),
    label: z.string().nullable(),
    placeholder: z.string().nullable(),
    errors: StrapiErrorRelationSchema,
  })
  .merge(HasOptionalStrapiIdSchema);

export type StrapiDateInput = z.infer<typeof StrapiDateInputSchema>;

export const renderDateInputFromStrapi = (strapiDateInput: StrapiDateInput) => (
  <DateInput
    name={strapiDateInput.name}
    label={strapiDateInput.label ?? undefined}
    placeholder={strapiDateInput.placeholder ?? undefined}
    errorMessages={flattenStrapiErrors(strapiDateInput.errors)}
  />
);
