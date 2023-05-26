import { z } from "zod";
import { FormContentCmsSchema } from "./FormContentCms";
import { HasLocaleSchema } from "./HasLocale";
import { HasTimestampsSchema } from "./HasTimestamps";

export const ElementWithIdSchema = z
  .object({
    elementId: z.string(),
    element: z.array(FormContentCmsSchema),
  })
  .merge(HasLocaleSchema)
  .merge(HasTimestampsSchema)
  .strict();

export type ElementWithId = z.infer<typeof ElementWithIdSchema>;
