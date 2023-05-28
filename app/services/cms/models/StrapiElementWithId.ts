import { z } from "zod";
import { FormContentCmsSchema } from "./FormContentCms";
import { HasLocaleSchema } from "./HasLocale";
import { HasTimestampsSchema } from "./HasTimestamps";

export const StrapiElementWithIdSchema = z
  .object({
    elementId: z.string(),
    element: z.array(FormContentCmsSchema),
  })
  .merge(HasLocaleSchema)
  .merge(HasTimestampsSchema)
  .strict();

export type StrapiElementWithId = z.infer<typeof StrapiElementWithIdSchema>;
