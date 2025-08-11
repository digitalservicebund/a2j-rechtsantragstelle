import { z } from "zod";
import { HasStrapiIdSchema } from "../HasStrapiId";
import { StrapiErrorCategorySchema } from "../StrapiErrorCategory";

export const StrapiCheckboxComponentSchema = z
  .object({
    __component: z.literal("form-elements.checkbox"),
    name: z.string(),
    label: z.string(),
    isRequiredError: StrapiErrorCategorySchema.nullable(),
    ...HasStrapiIdSchema.shape,
  })
  .transform(({ isRequiredError, ...cmsData }) => ({
    ...cmsData,
    required: isRequiredError !== null,
    errorMessage: isRequiredError?.errorCodes[0].text,
  }));
