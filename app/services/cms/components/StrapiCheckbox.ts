import { z } from "zod";
import { HasStrapiIdSchema } from "../models/HasStrapiId";
import { StrapiErrorCategorySchema } from "../models/StrapiErrorCategory";

export const StrapiCheckboxComponentSchema = z
  .object({
    __component: z.literal("form-elements.checkbox"),
    name: z.string(),
    label: z.string(),
    isRequiredError:
      StrapiErrorCategorySchema.merge(HasStrapiIdSchema).nullable(),
  })
  .merge(HasStrapiIdSchema)
  .transform(({ isRequiredError, ...cmsData }) => ({
    ...cmsData,
    required: isRequiredError !== null,
    errorMessage: isRequiredError?.errorCodes[0].text,
  }));
