import { z } from "zod";
import { LocalizableSchema } from "./Localizable";
import { TimestampableSchema } from "./Timestampable";

export const VorabCheckCommonsSchema = LocalizableSchema.merge(
  TimestampableSchema
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
