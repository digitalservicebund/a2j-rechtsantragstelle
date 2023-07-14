import { z } from "zod";
import { StrapiContentSchema } from "./StrapiContent";
import { HasStrapiLocaleSchema } from "./HasStrapiLocale";
import { HasStrapiTimestampsSchema } from "./HasStrapiTimestamps";

export const StrapiElementWithIdSchema = z
  .object({
    elementId: z.string(),
    element: z.array(StrapiContentSchema),
  })
  .merge(HasStrapiLocaleSchema)
  .merge(HasStrapiTimestampsSchema);

export type StrapiElementWithId = z.infer<typeof StrapiElementWithIdSchema>;
