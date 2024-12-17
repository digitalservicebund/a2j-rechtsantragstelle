import { z } from "zod";
import Checkbox from "~/components/inputs/Checkbox";
import {
  HasOptionalStrapiIdSchema,
  HasStrapiIdSchema,
} from "../models/HasStrapiId";
import { StrapiErrorCategorySchema } from "../models/StrapiErrorCategory";

const StrapiCheckboxSchema = z
  .object({
    name: z.string(),
    label: z.string(),
    isRequiredError:
      StrapiErrorCategorySchema.merge(HasStrapiIdSchema).nullable(),
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
    required={isRequiredError !== null}
    errorMessage={isRequiredError?.errorCodes[0].text}
    {...props}
  />
);
