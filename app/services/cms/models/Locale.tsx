import { z } from "zod";

export const LocaleSchema = z.union([z.literal("de"), z.literal("en")]);

export type Locale = z.infer<typeof LocaleSchema>;
