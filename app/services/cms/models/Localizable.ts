import { z } from "zod";
import { LocaleSchema } from "./Locale";

export const LocalizableSchema = z.object({
  locale: LocaleSchema,
});

export type Localizable = z.infer<typeof LocalizableSchema>;
