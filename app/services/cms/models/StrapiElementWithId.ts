import { z } from "zod";
import { StrapiContentComponentSchema } from "./StrapiContentComponent";
import { HasStrapiLocaleSchema } from "./HasStrapiLocale";
import { HasStrapiTimestampsSchema } from "./HasStrapiTimestamps";

export const StrapiElementWithIdSchema = z
  .object({
    elementId: z.string(),
    element: z.array(StrapiContentComponentSchema),
  })
  .merge(HasStrapiLocaleSchema)
  .merge(HasStrapiTimestampsSchema);

export type StrapiElementWithId = z.infer<typeof StrapiElementWithIdSchema>;
