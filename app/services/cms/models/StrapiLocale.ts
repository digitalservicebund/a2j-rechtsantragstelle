import { z } from "zod";

export const StrapiLocaleSchema = z.enum(["de", "en", "sg"]);
export const defaultLocale = StrapiLocaleSchema.Values.de;
export const stagingLocale = StrapiLocaleSchema.Values.sg;
export type StrapiLocale = z.infer<typeof StrapiLocaleSchema>;
