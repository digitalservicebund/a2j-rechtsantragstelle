import { z } from "zod";
import { HasOptionalStrapiIdSchema } from "./HasStrapiId";
import { HasStrapiLocaleSchema } from "./HasStrapiLocale";
import { HasStrapiTimestampsSchema } from "./HasStrapiTimestamps";

export const StrapiAmtsgerichtCommonSchema = z
  .object({
    backButton: z.string(),
    continueWithDefaultStreet: z.string(),
    featureName: z.string(),
    repeatSearch: z.string(),
    resultAddress: z.string(),
    resultHeading: z.string(),
    resultListHeading: z.string(),
    resultListSubHeading: z.string(),
    resultPhone: z.string(),
    resultWebsite: z.string(),
    searchHeading: z.string(),
    submitButton: z.string(),
  })
  .merge(HasOptionalStrapiIdSchema)
  .merge(HasStrapiLocaleSchema)
  .merge(HasStrapiTimestampsSchema);
