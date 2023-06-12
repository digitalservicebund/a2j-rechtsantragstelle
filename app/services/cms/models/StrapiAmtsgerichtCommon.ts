import { z } from "zod";
import { HasStrapiLocaleSchema } from "./HasStrapiLocale";
import { HasStrapiTimestampsSchema } from "./HasStrapiTimestamps";
import { HasOptionalStrapiIdSchema } from "./HasStrapiId";

export const StrapiAmtsgerichtCommonSchema = z
  .object({
    featureName: z.string(),
    searchHeading: z.string(),
    resultHeading: z.string(),
    resultAddress: z.string(),
    resultPhone: z.string(),
    resultWebsite: z.string(),
    repeatSearch: z.string(),
  })
  .merge(HasOptionalStrapiIdSchema)
  .merge(HasStrapiLocaleSchema)
  .merge(HasStrapiTimestampsSchema)
  .strict();

export type StrapiAmtsgerichtCommon = z.infer<
  typeof StrapiAmtsgerichtCommonSchema
>;
