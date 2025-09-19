import { z } from "zod";
import { HasStrapiIdSchema } from "../HasStrapiId";
import { StrapiErrorCategorySchema } from "../StrapiErrorCategory";
import { omitNull } from "~/util/omitNull";

export const StrapiCheckboxComponentSchema = z
  .object({
    __component: z.literal("form-elements.checkbox"),
    name: z.string(),
    label: z.string(),
    isRequiredError: StrapiErrorCategorySchema.nullable()
      .transform(omitNull)
      .optional(),
    ...HasStrapiIdSchema.shape,
  })
  .transform(({ isRequiredError, ...cmsData }) => ({
    ...cmsData,
    required: isRequiredError !== undefined,
    errorMessage: isRequiredError?.errorCodes[0].text,
  }));

export type StrapiCheckboxComponent = z.infer<
  typeof StrapiCheckboxComponentSchema
>;
