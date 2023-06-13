import { z } from "zod";
import { HasStrapiLocaleSchema } from "./HasStrapiLocale";
import { HasStrapiTimestampsSchema } from "./HasStrapiTimestamps";
import { HasOptionalStrapiIdSchema } from "./HasStrapiId";

export const StrapiAmtsgerichtCommonSchema = z
  .object({
    backButton: z.string(),
    continueWithDefaultStreet: z.string(),
    featureName: z.string(),
    repeatSearch: z.string(),
    resultAddress: z.string(),
    resultHeading: z.string(),
    resultListHeading: z.string(),
    resultPhone: z.string(),
    resultWebsite: z.string(),
    searchHeading: z.string(),
    submitButton: z.string(),
  })
  .merge(HasOptionalStrapiIdSchema)
  .merge(HasStrapiLocaleSchema)
  .merge(HasStrapiTimestampsSchema)
  .strict();

export type StrapiAmtsgerichtCommon = z.infer<
  typeof StrapiAmtsgerichtCommonSchema
>;
