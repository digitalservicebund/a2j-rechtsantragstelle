import { z } from "zod";
import { type CheckboxProps } from "~/components/inputs/Checkbox";
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

type StrapiCheckboxSchema = z.infer<typeof StrapiCheckboxSchema>;

export const StrapiCheckboxComponentSchema = StrapiCheckboxSchema.extend({
  __component: z.literal("form-elements.checkbox"),
});

export const getCheckboxProps = (
  cmsData: StrapiCheckboxSchema,
): CheckboxProps => ({
  ...cmsData,
  required: cmsData.isRequiredError !== null,
  errorMessage: cmsData.isRequiredError?.errorCodes[0].text,
});
