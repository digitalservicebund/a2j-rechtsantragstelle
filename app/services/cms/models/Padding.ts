import { z } from "zod";

export const PaddingSchema = z.union([
  z.literal("default"),
  z.literal("0"),
  z.literal("8"),
  z.literal("16"),
  z.literal("24"),
  z.literal("32"),
  z.literal("40"),
  z.literal("48"),
  z.literal("56"),
  z.literal("64"),
]);

export type Padding = z.infer<typeof PaddingSchema>;
