import { z } from "zod";
import { StrapiLocaleSchema } from "./StrapiLocale";

export const HasStrapiLocaleSchema = z.object({
  locale: StrapiLocaleSchema,
});

export type HasStrapiLocale = z.infer<typeof HasStrapiLocaleSchema>;
