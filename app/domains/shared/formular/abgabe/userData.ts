import { z } from "zod";
import { customRequiredErrorMessage } from "~/services/validation/YesNoAnswer";

export const abgabeInputSchema = {
  abgabeArt: z.enum(["online", "ausdrucken"], customRequiredErrorMessage),
};

const _partialSchema = z.object(abgabeInputSchema).partial();
export type AbgabeUserData = z.infer<typeof _partialSchema>;
