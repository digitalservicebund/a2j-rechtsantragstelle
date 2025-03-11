import { z } from "zod";
import { HasStrapiIdSchema } from "~/services/cms/models/HasStrapiId";
import { StrapiErrorCategorySchema } from "~/services/cms/models/StrapiErrorCategory";

export const StrapiErrorRelationSchema = z
  .array(StrapiErrorCategorySchema.merge(HasStrapiIdSchema))
  .optional()
  .transform((cmsDataErrors) =>
    cmsDataErrors?.flatMap((cmsError) => cmsError.errorCodes),
  );
