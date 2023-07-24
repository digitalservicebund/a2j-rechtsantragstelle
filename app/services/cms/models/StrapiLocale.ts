import { z } from "zod";

export const StrapiLocaleSchema = z.enum(["de", "en", "sg"]);

export type StrapiLocale = z.infer<typeof StrapiLocaleSchema>;
