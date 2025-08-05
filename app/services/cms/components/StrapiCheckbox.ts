import { z } from "zod";
import { HasStrapiIdSchema } from "../models/HasStrapiId";
import { StrapiErrorCategorySchema } from "../models/StrapiErrorCategory";

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
    errorMessage: isRequiredError?.errorCodes[0].text,
  }));

export type StrapiCheckboxComponent = z.infer<
  typeof StrapiCheckboxComponentSchema
>;
