import { z } from "zod";
import { HasStrapiLocaleSchema } from "./HasStrapiLocale";
import { HasStrapiTimestampsSchema } from "./HasStrapiTimestamps";
import { HasOptionalStrapiIdSchema } from "./HasStrapiId";

export const StrapiVorabCheckCommonsSchema = z
  .object({
    progressBarLabel: z.string(),
    resultHintLabel: z.string(),
    backButtonDefaultLabel: z.string(),
    nextButtonDefaultLabel: z.string(),
    lastNextButtonLabel: z.string(),
  })
  .merge(HasOptionalStrapiIdSchema)
  .merge(HasStrapiLocaleSchema)
  .merge(HasStrapiTimestampsSchema)
  .strict();

export type StrapiVorabCheckCommons = z.infer<
  typeof StrapiVorabCheckCommonsSchema
>;
