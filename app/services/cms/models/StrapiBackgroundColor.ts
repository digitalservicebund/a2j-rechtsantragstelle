import { z } from "zod";

export const StrapiBackgroundColorSchema = z.enum([
  "default",
  "white",
  "blue",
  "yellow",
  "green",
  "red",
]);

export type StrapiBackgroundColor = z.infer<typeof StrapiBackgroundColorSchema>;
