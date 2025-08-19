import { z } from "zod";

export const abgabeInputSchema = {
  abgabeArt: z.enum(["online", "ausdrucken"]),
};

const _partialSchema = z.object(abgabeInputSchema).partial();
export type AbgabeUserData = z.infer<typeof _partialSchema>;
