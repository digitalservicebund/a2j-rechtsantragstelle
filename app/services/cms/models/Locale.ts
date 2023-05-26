import { z } from "zod";

export const LocaleSchema = z.enum(["de", "en"]);

export type Locale = z.infer<typeof LocaleSchema>;
