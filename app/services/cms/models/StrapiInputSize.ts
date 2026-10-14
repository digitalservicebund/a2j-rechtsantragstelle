import z from "zod";

export const StrapiSize = z
  .enum(["large", "medium", "small"])
  .nullable()
  .transform((value) => value ?? "large")
  .optional()
  .default("large");
