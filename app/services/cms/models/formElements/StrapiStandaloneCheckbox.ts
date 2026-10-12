import { z } from "zod";
import { omitNull } from "~/util/omitNull";
import { HasStrapiIdSchema } from "../HasStrapiId";
import { StrapiErrorCategorySchema } from "../StrapiErrorCategory";
import { StrapiStringOptionalSchema } from "../StrapiStringOptional";

export const StrapiStandaloneCheckboxComponentSchema = z
  .object({
    __component: z.literal("form-elements.standalone-checkbox"),
    name: z.string(),
    text: z.string(),
    label: StrapiStringOptionalSchema,
    error: StrapiErrorCategorySchema.nullable().transform(omitNull).optional(),
    ...HasStrapiIdSchema.shape,
  })
  .transform(({ error, ...cmsData }) => ({
    ...cmsData,
    required: error !== undefined,
    errorMessage: error?.errorCodes[0].text,
  }));
