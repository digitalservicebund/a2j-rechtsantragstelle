import { z } from "zod";
import { LocaleSchema } from "./Locale";

export const HasLocaleSchema = z.object({
  locale: LocaleSchema,
});

export type HasLocale = z.infer<typeof HasLocaleSchema>;
