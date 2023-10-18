import { z } from "zod";

export const phoneNumberSchema = z
  .string()
  .trim()
  .min(1, { message: "required" })
  .regex(/^\+?[0-9]{1,50}$/, { message: "invalid" });
