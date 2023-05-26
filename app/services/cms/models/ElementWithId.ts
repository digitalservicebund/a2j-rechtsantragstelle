import { z } from "zod";
import { FormContentCmsSchema } from "./FormContentCms";
import { HasLocaleSchema } from "./HasLocale";
import { HasTimestampsSchema } from "./HasTimestamps";

export const ElementWithIdSchema = z
  .object({
    id: z.number().optional(),
    elementId: z.string(),
    element: z.array(FormContentCmsSchema),
  })
  .merge(HasLocaleSchema)
  .merge(HasTimestampsSchema);

export type ElementWithId = z.infer<typeof ElementWithIdSchema>;
