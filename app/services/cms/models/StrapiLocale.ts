import { z } from "zod";

export const StrapiLocaleSchema = z.enum(["de", "en", "sg"]);
export const defaultLocale = StrapiLocaleSchema.enum.de;
export const stagingLocale = StrapiLocaleSchema.enum.sg;
export type StrapiLocale = z.infer<typeof StrapiLocaleSchema>;
