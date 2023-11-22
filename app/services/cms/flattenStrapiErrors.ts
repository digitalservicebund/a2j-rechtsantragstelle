import { z } from "zod";
import { HasStrapiIdSchema } from "~/services/cms/models/HasStrapiId";
import { StrapiErrorCategorySchema } from "~/services/cms/models/StrapiErrorCategory";

export const StrapiErrorRelationSchema = z.object({
  data: z
    .array(
      HasStrapiIdSchema.extend({
        attributes: StrapiErrorCategorySchema,
      }),
    )
    .optional(),
});

type StrapiErrorRelation = z.infer<typeof StrapiErrorRelationSchema>;

export const flattenStrapiErrors = (cmsDataErrors: StrapiErrorRelation) => {
  return cmsDataErrors.data?.flatMap(
    (cmsError) => cmsError.attributes.errorCodes,
  );
};
