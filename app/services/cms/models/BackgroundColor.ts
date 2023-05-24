import { z } from "zod";

export const BackgroundColorSchema = z.union([
  z.literal("default"),
  z.literal("white"),
  z.literal("blue"),
  z.literal("yellow"),
  z.literal("green"),
  z.literal("red"),
]);

export type BackgroundColor = z.infer<typeof BackgroundColorSchema>;
