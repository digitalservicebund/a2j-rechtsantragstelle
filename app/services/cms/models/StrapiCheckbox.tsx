import { z } from "zod";
import { HasOptionalStrapiIdSchema, HasStrapiIdSchema } from "./HasStrapiId";
import Checkbox from "~/components/inputs/Checkbox";
import { StrapiErrorCategorySchema } from "./StrapiErrorCategory";

export const StrapiCheckboxSchema = z
  .object({
    __component: z.literal("form-elements.checkbox").optional(),
    name: z.string(),
    label: z.string(),
    isRequiredError: z.object({
      data: HasStrapiIdSchema.extend({
        attributes: StrapiErrorCategorySchema,
      }).nullable(),
    }),
  })
  .merge(HasOptionalStrapiIdSchema);

export const renderCheckboxFromStrapi = (
  strapiCheckbox: z.infer<typeof StrapiCheckboxSchema>,
) => (
  <Checkbox
    name={strapiCheckbox.name}
    label={strapiCheckbox.label ?? undefined}
    required={strapiCheckbox.isRequiredError.data !== null}
    errorMessage={
      strapiCheckbox.isRequiredError?.data?.attributes.errorCodes[0].text
    }
  />
);
