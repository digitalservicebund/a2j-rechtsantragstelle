import { z } from "zod";
import { HasLocaleSchema } from "./HasLocale";
import { HasTimestampsSchema } from "./HasTimestamps";

export const VorabCheckCommonsSchema = HasLocaleSchema.merge(
  HasTimestampsSchema
).merge(
  z.object({
    progressBarLabel: z.string(),
    resultHintLabel: z.string(),
    backButtonDefaultLabel: z.string(),
    nextButtonDefaultLabel: z.string(),
    lastNextButtonLabel: z.string(),
  })
);

export type VorabCheckCommons = z.infer<typeof VorabCheckCommonsSchema>;
