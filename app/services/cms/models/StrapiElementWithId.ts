import { z } from "zod";
import { HasStrapiIdSchema } from "./HasStrapiId";
import { HasStrapiLocaleSchema } from "./HasStrapiLocale";
import { StrapiContentComponentSchema } from "./StrapiContentComponent";

export const StrapiElementWithIdSchema = z.object({
  elementId: z.string(),
  element: z.array(StrapiContentComponentSchema),
  ...HasStrapiLocaleSchema.shape,
  ...HasStrapiIdSchema.shape,
});
