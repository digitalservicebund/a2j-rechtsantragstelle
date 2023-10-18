import { z } from "zod";

export const inputRequiredSchema = z
  .string()
  .trim()
  .min(1, { message: "required" });
