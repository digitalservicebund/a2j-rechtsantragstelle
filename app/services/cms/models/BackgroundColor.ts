import { z } from "zod";

export const BackgroundColorSchema = z.enum([
  "default",
  "white",
  "blue",
  "yellow",
  "green",
  "red",
]);

export type BackgroundColor = z.infer<typeof BackgroundColorSchema>;
