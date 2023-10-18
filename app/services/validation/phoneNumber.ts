import { z } from "zod";

export const phoneNumberSchema = z
  .string()
  .trim()
  .regex(/^\+?[0-9]{1,50}$/, { message: "invalid" });
