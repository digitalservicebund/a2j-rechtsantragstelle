import { z } from "zod";
import { HasStrapiLocaleSchema } from "./HasStrapiLocale";
import { StrapiContentComponentSchema } from "./StrapiContentComponent";

export const StrapiElementWithIdSchema = z
  .object({
    elementId: z.string(),
    element: z.array(StrapiContentComponentSchema),
  })
  .merge(HasStrapiLocaleSchema);

export type StrapiElementWithId = z.infer<typeof StrapiElementWithIdSchema>;
