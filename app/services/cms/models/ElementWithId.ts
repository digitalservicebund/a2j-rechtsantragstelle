import { z } from "zod";
import { FormContentCmsSchema } from "./FormContentCms";
import { HasLocaleSchema } from "./HasLocale";
import { HasTimestampsSchema } from "./HasTimestamps";

export const ElementWithIdSchema = HasLocaleSchema.merge(
  HasTimestampsSchema
).merge(
  z.object({
    id: z.number().optional(),
    elementId: z.string(),
    element: z.array(FormContentCmsSchema),
  })
);

export type ElementWithId = z.infer<typeof ElementWithIdSchema>;
