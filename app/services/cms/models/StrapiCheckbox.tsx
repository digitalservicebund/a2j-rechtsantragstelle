import { z } from "zod";
import { HasOptionalStrapiIdSchema, HasStrapiIdSchema } from "./HasStrapiId";
import Checkbox from "~/components/inputs/Checkbox";
import { StrapiErrorCategorySchema } from "./StrapiErrorCategory";

const StrapiCheckboxSchema = z
  .object({
    name: z.string(),
    label: z.string(),
    isRequiredError: z.object({
      data: HasStrapiIdSchema.extend({
        attributes: StrapiErrorCategorySchema,
      }).nullable(),
    }),
  })
  .merge(HasOptionalStrapiIdSchema);

export const StrapiCheckboxComponentSchema = StrapiCheckboxSchema.extend({
  __component: z.literal("form-elements.checkbox"),
});

export const StrapiCheckbox = ({
  isRequiredError,
  ...props
}: z.infer<typeof StrapiCheckboxSchema>) => (
  <Checkbox
    required={isRequiredError.data !== null}
    errorMessage={isRequiredError?.data?.attributes.errorCodes[0].text}
    {...props}
  />
);
