import { z } from "zod";
import { StrapiErrorCategorySchema } from "~/services/cms/models/StrapiErrorCategory";

export const StrapiErrorRelationSchema = z
  .array(StrapiErrorCategorySchema)
  .nullable()
  .transform((errors) => errors?.flatMap((cmsError) => cmsError.errorCodes))
  .optional();
