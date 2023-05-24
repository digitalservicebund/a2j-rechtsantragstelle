import { z } from "zod";
import { FormContentCmsSchema } from "./FormContentCms";
import { LocalizableSchema } from "./Localizable";
import { TimestampableSchema } from "./Timestampable";

export const ElementWithIdSchema = LocalizableSchema.merge(
  TimestampableSchema
).merge(
  z.object({
    id: z.number().optional(),
    elementId: z.string(),
    element: z.array(FormContentCmsSchema),
  })
);

export type ElementWithId = z.infer<typeof ElementWithIdSchema>;
