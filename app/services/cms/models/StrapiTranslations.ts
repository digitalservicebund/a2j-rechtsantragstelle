import { z } from "zod";
import { HasStrapiLocaleSchema } from "./HasStrapiLocale";

export const StrapiTranslationSchema = z
  .object({
    scope: z.string(),
    field: z.array(z.object({ name: z.string(), value: z.string() })),
  })
  .merge(HasStrapiLocaleSchema);
