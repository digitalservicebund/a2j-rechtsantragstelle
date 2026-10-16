import { z } from "zod";

export const StrapiLocaleSchema = z.enum(["de", "en"]);
export const defaultLocale = StrapiLocaleSchema.enum.de;
export type StrapiLocale = z.infer<typeof StrapiLocaleSchema>;
