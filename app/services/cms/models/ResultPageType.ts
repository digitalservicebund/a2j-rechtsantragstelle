import { z } from "zod";

export const ResultPageTypeSchema = z.union([
  z.literal("error"),
  z.literal("success"),
  z.literal("warning"),
]);

export type ResultPageType = z.infer<typeof ResultPageTypeSchema>;
