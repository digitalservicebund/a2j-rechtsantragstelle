import { z } from "zod";
import { HasStrapiIdSchema } from "~/services/cms/models/HasStrapiId";
import { StrapiErrorCategorySchema } from "~/services/cms/models/StrapiErrorCategory";

export const StrapiErrorRelationSchema = z
  .array(StrapiErrorCategorySchema.merge(HasStrapiIdSchema))
  .optional();

type StrapiErrorRelation = z.infer<typeof StrapiErrorRelationSchema>;

export const flattenStrapiErrors = (cmsDataErrors: StrapiErrorRelation) => {
  return cmsDataErrors?.flatMap((cmsError) => cmsError.errorCodes);
};
