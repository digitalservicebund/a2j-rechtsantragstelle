import { z } from "zod";
import { StrapiContentComponentSchema } from "./formElements/StrapiContentComponent";
import { HasStrapiIdSchema } from "./HasStrapiId";
import { HasStrapiLocaleSchema } from "./HasStrapiLocale";

export const StrapiElementWithIdSchema = z.object({
  elementId: z.string(),
  element: z.array(StrapiContentComponentSchema),
  ...HasStrapiLocaleSchema.shape,
  ...HasStrapiIdSchema.shape,
});
