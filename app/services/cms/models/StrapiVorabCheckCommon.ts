import { z } from "zod";
import { HasOptionalStrapiIdSchema } from "./HasStrapiId";
import { HasStrapiLocaleSchema } from "./HasStrapiLocale";
import { HasStrapiTimestampsSchema } from "./HasStrapiTimestamps";

export const StrapiVorabCheckCommonSchema = z
  .object({
    progressBarLabel: z.string(),
    resultHintLabel: z.string(),
    backButtonDefaultLabel: z.string(),
    nextButtonDefaultLabel: z.string(),
    lastNextButtonLabel: z.string(),
  })
  .merge(HasOptionalStrapiIdSchema)
  .merge(HasStrapiLocaleSchema)
  .merge(HasStrapiTimestampsSchema);
