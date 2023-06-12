import { z } from "zod";
import { HasStrapiLocaleSchema } from "./HasStrapiLocale";
import { HasStrapiTimestampsSchema } from "./HasStrapiTimestamps";
import { HasOptionalStrapiIdSchema } from "./HasStrapiId";

export const StrapiAmtsgerichtCommonSchema = z
  .object({
    ergebnisHeading: z.string(),
    ergebnisLabel: z.string(),
    ergebnisAddress: z.string(),
    ergebnisTelephone: z.string(),
    ergebnisWebsite: z.string(),
    repeatSearch: z.string(),
  })
  .merge(HasOptionalStrapiIdSchema)
  .merge(HasStrapiLocaleSchema)
  .merge(HasStrapiTimestampsSchema)
  .strict();

export type StrapiAmtsgerichtCommon = z.infer<
  typeof StrapiAmtsgerichtCommonSchema
>;
